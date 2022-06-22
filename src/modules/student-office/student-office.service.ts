import { LeaderboardService } from './../leaderboard/leaderboard.service';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Office,
  OfficeDocument,
} from 'src/modules/office/entities/office.entity';
import { Quest } from './../quest/entities/quest.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { StudentOffice } from './entities/student-office.entity';
import { EmailService } from '../email/email.service';

@Injectable()
export class StudentOfficeService {
  constructor(
    @InjectModel(StudentOffice.name)
    private studentOfficeModel: mongoose.Model<StudentOffice>,
    @InjectModel(Quest.name) private questModel: mongoose.Model<Quest>,
    @InjectModel(Office.name) private officeModel: mongoose.Model<Office>,
    @InjectModel(User.name) private userModel: mongoose.Model<User>,
    private readonly leaderboardService: LeaderboardService,
    private readonly emailService: EmailService,
  ) {}

  async findAll(userId: string, officeIds: string[]) {
    const query = {
      user: userId,
    };

    if (officeIds) {
      query['office'] = { $in: officeIds };
    }

    const res = await this.studentOfficeModel
      .find(query)
      .populate('office', 'parent');

    return res.map((each: any) => {
      return {
        ...each.toJSON(),
        office: each.office._id,
        parent: each.office.parent,
      };
    });
  }

  async firstOrCreate(userId: string, officeId: string) {
    const currStudentOffice = await this.studentOfficeModel.findOne({
      office: officeId,
      user: userId,
    });

    if (currStudentOffice && currStudentOffice.quests.length > 0) {
      return currStudentOffice;
    }

    const quests = await this.questModel.find(
      { office: officeId },
      { _id: true },
      { sort: { order: 'asc' } },
    );

    if (currStudentOffice && currStudentOffice.quests?.length === 0) {
      currStudentOffice.quests = quests;
      await currStudentOffice.save();

      return currStudentOffice;
    }

    return this.studentOfficeModel.create({
      office: officeId,
      user: userId,
      quests: quests,
    });
  }

  findOfficesByStudent(userId: string) {
    return this.studentOfficeModel.find({
      user: userId,
    });
  }

  async updateLastCompleted(
    userId: string = null,
    officeId: string,
    questId: string,
  ) {
    const studentOffice = await this.studentOfficeModel.findOneAndUpdate(
      {
        office: officeId,
        user: userId,
      },
      { lastCompleted: questId, $inc: { numOfQuestsCompleted: 1 } },
      { new: true },
    );

    //all completed
    if (studentOffice.numOfQuestsCompleted === studentOffice.quests.length) {
      studentOffice.completed = true;

      await Promise.all([
        studentOffice.save(),
        studentOffice.populate('office office.parent'),
      ]);

      //reward stamp
      await this.rewardStamp(userId, studentOffice.office);

      //sub-office
      if (studentOffice.office.parent) {
        const childOffices = await this.officeModel.find(
          {
            parent: studentOffice.office.parent,
          },
          { _id: 1 },
        );

        const cntCompleted = await this.studentOfficeModel.count({
          office: { $in: childOffices.map((o) => o.id) },
          user: userId,
          completed: true,
        });

        if (cntCompleted === childOffices.length) {
          await this.rewardStamp(userId, studentOffice.office.parent);
        }
      }
    }

    return studentOffice;
  }

  private async rewardStamp(userId: string, office: any) {
    //reward stamp
    const user = await this.userModel.findByIdAndUpdate(userId, {
      $push: {
        'student.officesCompleted': office.id,
      },
    });

    //increment leaderboard score
    await this.leaderboardService.increment(userId);

    this.emailService.sendMail({
      name: 'stamp.received',
      to: user.email,
      replacements: {
        name: user.firstName,
        officeName: office.name,
      },
      //TODO button link
      button: {
        name: 'Check it out!',
        link: '#',
      },
    });
  }
}
