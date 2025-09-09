import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document , Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  [x: string]: any;
  
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;


  @Prop({ type: Types.ObjectId, ref: 'Role' })
  role: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
