import { Quest } from './../quest/entities/quest.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { StudentOffice } from './entities/student-office.entity';

@Injectable()
export class StudentOfficeService {
  constructor(
    @InjectModel(StudentOffice.name)
    private studentOfficeModel: mongoose.Model<StudentOffice>,
    @InjectModel(Quest.name) private questModel: mongoose.Model<Quest>,
  ) {}

  async firstOrCreate(userId: string, officeId: string) {
    const studentOffice = await this.studentOfficeModel.findOne({
      office: officeId,
      user: userId,
    });

    if (studentOffice) {
      return studentOffice;
    }

    const quests = await this.questModel.find(
      { office: officeId },
      { _id: true },
      { sort: { order: 'asc' } },
    );

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

  //TODO: more logic to give stamp
  updateLastCompleted(userId: string, officeId: string, questId: string) {
    return this.studentOfficeModel.updateOne(
      {
        office: officeId,
        user: userId,
      },
      { lastCompleted: questId },
    );
  }
}
