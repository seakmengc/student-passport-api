import { User } from 'src/modules/user/entities/user.entity';
import { Office } from 'src/modules/office/entities/office.entity';
import { Quest } from './../quest/entities/quest.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { StudentOffice } from './entities/student-office.entity';

@Injectable()
export class StudentOfficeService {
  constructor(
    @InjectModel(StudentOffice.name)
    private studentOfficeModel: mongoose.Model<StudentOffice>,
    @InjectModel(Quest.name) private questModel: mongoose.Model<Quest>,
    @InjectModel(Office.name) private officeModel: mongoose.Model<Office>,
    @InjectModel(User.name) private userModel: mongoose.Model<User>,
  ) {}

  async firstOrCreate(userId: string, officeId: string) {
    const currStudentOffice = await this.studentOfficeModel.findOne({
      office: officeId,
      user: userId,
    });

    if (currStudentOffice) {
      return currStudentOffice;
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

    Logger.log(studentOffice);
    //all completed
    if (studentOffice.numOfQuestsCompleted === studentOffice.quests.length) {
      studentOffice.completed = true;

      await Promise.all([
        studentOffice.save(),
        studentOffice.populate('office'),
        //reward stamp
        this.userModel.updateOne(
          { _id: userId },
          { $push: { 'student.officesCompleted': studentOffice } },
        ),
      ]);

      //sub-office
      if (studentOffice.office.parent) {
        const childOffices = await this.officeModel.find({
          parent: studentOffice.office.parent,
        });

        const cntCompleted = await this.studentOfficeModel.count({
          office: { $in: childOffices.map((o) => o._id) },
          user: userId,
          completed: true,
        });

        Logger.log([cntCompleted, childOffices]);

        if (cntCompleted === childOffices.length) {
          //reward stamp
          await this.userModel.updateOne(
            { _id: userId },
            {
              $push: {
                'student.officesCompleted': studentOffice.office.parent,
              },
            },
          );
        }
      }
    }

    return studentOffice;
  }
}
