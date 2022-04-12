import { StudentOfficeService } from './../student-office/student-office.service';
import {
  StudentQuest,
  StudentQuestStatus,
} from './entities/student-quest.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateStudentQuestDto } from './dto/create-student-quest.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Quest } from '../quest/entities/quest.entity';
import { PaginationResponse } from 'src/common/res/pagination.res';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ApproveStudentQuestDto } from './dto/approve-student-quest.dto';

@Injectable()
export class StudentQuestService {
  constructor(
    @InjectModel(StudentQuest.name)
    private studentQuestModel: mongoose.Model<StudentQuest>,
    @InjectModel(Quest.name) private questModel: mongoose.Model<Quest>,
    private studentOfficeService: StudentOfficeService,
  ) {}

  async getLatestQuest(userId: string, officeId: string) {
    const studentOffice = await this.studentOfficeService.firstOrCreate(
      userId,
      officeId,
    );

    let lastId: string;
    if (studentOffice.lastCompleted) {
      const currId = studentOffice.lastCompleted._id.toString();
      const ind = studentOffice.quests.findIndex(
        (q: Quest) => q._id.toString() === currId,
      );

      lastId = studentOffice.quests[ind + 1]
        ? studentOffice.quests[ind + 1]._id
        : null;
    } else {
      lastId = studentOffice.quests[0]?._id ?? null;
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
      curr = await this.studentQuestModel.create({
        ...createStudentQuestDto,
        user: userId,
      });
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

  findAllForApproval(paginationDto: PaginationDto) {
    const queryBuilder = this.studentQuestModel.find({
      status: StudentQuestStatus.PENDING,
    });

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
        studentQuest.quest.office._id,
        studentQuest.quest._id,
      );
    }

    return studentQuest;
  }
}
