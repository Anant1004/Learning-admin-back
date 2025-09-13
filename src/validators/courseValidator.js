import { z } from "zod";

export const courseSchema = z.object({
    title: z.string().min(1, "Title is required"),
    subtitle: z.string().optional(),
    description: z.string().min(1, "Description is required"),
    categoryId: z.string().min(1, "Category ID is required"),
    subCategoryId: z.string().min(1, "SubCategory ID is required"),
    subjectId: z.string().optional(),
    course_topic: z.array(z.string()).min(1, "At least one course topic is required"),
    course_languages: z.array(z.string()).min(1, "At least one course language is required"),
    subtitle_language: z.array(z.string()).min(1, "Subtitle language is required"),
    level: z.string().min(1, "Level is required"),
    duration: z.string().min(1, "Duration is required"),
    instructorId: z.array(z.string()).min(1, "Instructor ID is required"),
    paid: z.boolean(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    actualPrice: z.number().nullable().optional(),
    discountPrice: z.number().nullable().optional(),
    schedule: z.array(z.any()).min(1, "Schedule is required"),
    outcomes: z.array(z.any()).min(1, "Outcomes are required"),
    faq: z.array(z.any()).min(1, "FAQ is required"),
    thumbnail_url: z.string().url("Thumbnail must be a valid URL"),
    video_url: z.string().url("Video must be a valid URL"),
}).refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
}).refine((data) => {
    if (data.paid) {
        return data.actualPrice != null && data.discountPrice != null;
    }
    return true;
}, {
    message: "Actual price and discount price are required for paid courses",
    path: ["actualPrice"],
}).refine((data) => {
    if (data.paid && data.actualPrice != null && data.discountPrice != null) {
        return data.discountPrice <= data.actualPrice;
    }
    return true;
}, {
    message: "Discount price cannot be greater than actual price",
    path: ["discountPrice"],
});
