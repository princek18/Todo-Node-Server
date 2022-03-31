import mongoose from 'mongoose';

export const Task = mongoose.model('tasks', {
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
    }
})