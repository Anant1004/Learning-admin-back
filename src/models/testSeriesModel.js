import mongoose from "mongoose";

const testSeriesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    terms: {
        type: [String],
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    paid: {
        type: Boolean,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    totalMarks: {
        type: Number,
        required: true
    },
    marksPerQuestion: {
        type: Number,
        required: true
    },
    questions: [
        {
            question: {
                type: String,
                required: true
            },
            options: [
                {
                    name: {
                        type: String,
                        required: true
                    },
                    image: {
                        type: String
                    }
                }
            ],
            correctAns: {
                type: String,
                required: true
            }
        }
    ]
})

export default mongoose.model("TestSeries", testSeriesSchema);
