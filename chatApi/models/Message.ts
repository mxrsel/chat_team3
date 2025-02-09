import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  message: {
    type: String,
    required: [true, 'Message is required']
  },
  datetime: {
    type: String,
    default: () => new Date().toISOString(),
  },
});

MessageSchema.pre('save', function (next) {
  if (!this.message) {
    next(new Error('Message is missing'));
  } else {
    next();
  }
});

const Message = mongoose.model('Message', MessageSchema);
export default Message;