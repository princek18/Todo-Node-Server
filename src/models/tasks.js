import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        validate(value) {
            if (value.length < 4) {
                throw new Error("Title should be at least of 4 character.")
            }
        }
    },
    description: {
        type: String,
        required: true,
        validate(value) {
            if (value.length < 10) {
                throw new Error("Description should be at least of 10 character.")
            }
        }
    },
    time: {
        type: String,
        required: true
    },
    done: {
        type: Boolean,
        required: true,
        default: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})

taskSchema.methods.toJSON = function(){
    const task = this;
    const taskObject = task.toObject();
    delete taskObject.userId;

    return taskObject;
}

export const Task = mongoose.model('tasks', taskSchema);