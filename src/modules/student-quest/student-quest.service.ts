import { Role, User } from 'src/modules/user/entities/user.entity';
import { TokenPayload } from 'src/modules/auth/services/authentication.service';
import { Office } from 'src/modules/office/entities/office.entity';
import { StudentOfficeService } from './../student-office/student-office.service';
import {
  StudentQuest,
  StudentQuestDocument,
  StudentQuestStatus,
} from './entities/student-quest.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateStudentQuestDto } from './dto/create-student-quest.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Quest, QuestType } from '../quest/entities/quest.entity';
import { PaginationResponse } from 'src/common/res/pagination.res';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ApproveStudentQuestDto } from './dto/approve-student-quest.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class StudentQuestService {
  constructor(
    @InjectModel(StudentQuest.name)
    private studentQuestModel: mongoose.Model<StudentQuest>,
    @InjectModel(Quest.name) private questModel: mongoose.Model<Quest>,
    @InjectModel(Office.name) private officeModel: mongoose.Model<Office>,
    @InjectModel(User.name) private userModel: mongoose.Model<User>,
    private studentOfficeService: StudentOfficeService,
    private emailService: EmailService,
  ) {}

  async getLatestQuest(userId: string, officeId: string) {
    if (await this.officeModel.exists({ parent: officeId })) {
      throw new BadRequestException("Can't get quest for office with units.");
    }

    const studentOffice = await this.studentOfficeService.firstOrCreate(
      userId,
      officeId,
    );

    let lastId: string;
    if (studentOffice.lastCompleted) {
      const currId = studentOffice.lastCompleted.id;
      const ind = studentOffice.quests.findIndex((q: Quest) => q.id === currId);

      lastId = studentOffice.quests[ind + 1]
        ? studentOffice.quests[ind + 1].id
        : null;
    } else {
      lastId = studentOffice.quests[0]?.id ?? null;
    }

    let studentQuest: any = await this.studentQuestModel
      .findOne({
        user: userId,
        quest: lastId,
      })
      .populate('upload quest');

    if (!studentQuest) {
      studentQuest = new StudentQuest();

      studentQuest.quest = await this.questModel.findById(lastId);
      studentQuest.status = StudentQuestStatus.PENDING;
    }

    return studentQuest;
  }

  async create(userId: string, createStudentQuestDto: CreateStudentQuestDto) {
    let curr = await this.studentQuestModel.findOne({
      user: userId,
      quest: createStudentQuestDto.quest,
    });

    if (!curr) {
      const office = (
        await this.questModel
          .findById(createStudentQuestDto.quest, {
            office: 1,
          })
          .orFail()
      ).office;

      curr = await this.studentQuestModel.create({
        ...createStudentQuestDto,
        user: userId,
        office,
      });

      await this.determineAutoGrading(curr);
    } else {
      if (curr.status !== StudentQuestStatus.REJECTED) {
        throw new BadRequestException('Quest already submitted/approved.');
      }

      curr = await this.studentQuestModel.findByIdAndUpdate(
        curr._id,
        { ...createStudentQuestDto, status: StudentQuestStatus.PENDING },
        { new: true },
      );
    }

    return curr;
  }

  ///ADMIN

  async findAllForApproval(
    paginationDto: PaginationDto,
    payload: TokenPayload,
  ) {
    const filter = {
      status: StudentQuestStatus.PENDING,
    };

    if (payload.role !== Role.SUPER_ADMIN) {
      filter['office'] = {
        $in: (
          await this.officeModel.find({ admin: payload.sub }, { _id: 1 })
        ).map((office) => office.id),
      };
    }

    const queryBuilder = this.studentQuestModel.find(filter).sort('id');

    return new PaginationResponse(queryBuilder, paginationDto).getResponse();
  }

  findOne(id: string) {
    return this.studentQuestModel.findById(id).orFail();
  }

  async approve(
    userId: string,
    id: string,
    approveStudentQuestDto: ApproveStudentQuestDto,
  ) {
    const studentQuest = await this.studentQuestModel
      .findByIdAndUpdate(
        id,
        {
          status: approveStudentQuestDto.isApproved
            ? StudentQuestStatus.APPROVED
            : StudentQuestStatus.REJECTED,
          reason: approveStudentQuestDto.reason,
          approvedBy: userId,
          approvedAt: Date.now(),
        },
        { new: true },
      )
      .populate('quest');

    if (approveStudentQuestDto.isApproved) {
      await this.studentOfficeService.updateLastCompleted(
        userId,
        studentQuest.quest.office.id,
        studentQuest.quest.id,
      );
    } else {
      const user = await this.userModel.findById(userId, {
        email: 1,
        firstName: 1,
      });

      this.emailService.sendMail({
        name: 'quest.rejected',
        to: user.email,
        replacements: {
          name: user.firstName,
          reason: approveStudentQuestDto.reason ?? 'N/A',
        },
        //TODO link
        button: {
          name: 'Resubmit!',
          link: '#',
        },
      });
    }

    return studentQuest;
  }

  private async determineAutoGrading(studentQuest: StudentQuestDocument) {
    if (!studentQuest.populated('quest')) {
      await studentQuest.populate('quest');
    }

    console.log(studentQuest.quest);

    if (!studentQuest.quest.autoGrading) {
      return;
    }

    switch (studentQuest.quest.questType) {
      case QuestType.INPUT:
      case QuestType.MEDIA:
        studentQuest.status = StudentQuestStatus.APPROVED;
        break;
      case QuestType.MCQ:
        const correct = studentQuest.quest.possibleAnswers.find(
          (ans) => ans.correct,
        );
        if (!correct) {
          break;
        }
        console.log(studentQuest.answer, correct);

        if (studentQuest.answer.toString() === correct._id.toString()) {
          studentQuest.status = StudentQuestStatus.APPROVED;
        } else {
          studentQuest.status = StudentQuestStatus.REJECTED;
          studentQuest.reason = 'Wrong answer.';
        }
        break;
      default:
        throw new BadRequestException('Invalid quest type.');
    }

    studentQuest.approvedAt = new Date();
    await studentQuest.save();

    if (studentQuest.status === StudentQuestStatus.APPROVED) {
      await this.studentOfficeService.updateLastCompleted(
        studentQuest.user._id,
        studentQuest.quest.office.id,
        studentQuest.quest.id,
      );
    }
  }
}
