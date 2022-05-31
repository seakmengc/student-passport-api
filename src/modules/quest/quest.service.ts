import { Answer } from './entities/answer.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { CreateQuestDto } from './dto/create-quest.dto';
import { UpdateQuestDto } from './dto/update-quest.dto';
import { Quest, QuestType } from './entities/quest.entity';

@Injectable()
export class QuestService {
  constructor(@InjectModel(Quest.name) private model: mongoose.Model<Quest>) {}

  async create(createQuestDto: CreateQuestDto) {
    return this.model.create({
      ...createQuestDto,
      order:
        createQuestDto.order ??
        ((
          await this.model
            .findOne({ office: createQuestDto.office })
            .sort('-order')
        )?.order ?? 0) + 1,
      possibleAnswers:
        createQuestDto.questType === QuestType.MCQ
          ? createQuestDto.possibleAnswers
          : [],
    });
  }

  findAll() {
    return this.model.find({ isActive: true });
  }

  findByOffice(officeId: string) {
    return this.model.find({ office: officeId, isActive: true });
  }

  findByIds(ids: string[]) {
    return this.model.find({ _id: { $in: ids } });
  }

  findOne(id: string, projection = null) {
    return this.model.findById(id, projection).orFail();
  }

  async update(id: string, updateQuestDto: UpdateQuestDto) {
    return this.model.findByIdAndUpdate(id, updateQuestDto, { new: true });
  }

  remove(id: string) {
    return this.model.findByIdAndUpdate(id, { isActive: false }, { new: true });
  }
}
