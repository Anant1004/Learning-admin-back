import { z } from "zod";

export const courseSchema = z
  .object({
    title: z.string().min(10, "Title must be at least 10 characters long"),
    subtitle: z.string().optional(),
    description: z.string().min(10, "Description must be at least 10 characters long"),

    categoryId: z.string().min(1, "Category ID is required"),
    subCategoryId: z.string().min(1, "SubCategory ID is required"),

    course_topic: z.array(z.string()).min(1, "At least one course topic is required"),
    course_languages: z.array(z.string()).min(1, "At least one course language is required"),
    subtitle_language: z.array(z.string()).min(1, "At least one subtitle language is required"),

    level: z.enum(["Beginner", "Intermediate", "Advanced"], {
      required_error: "Level is required",
    }),

    duration: z.coerce.number().min(1, "Duration is required"),

    instructorId: z.array(z.string()).min(1, "At least one instructor is required"),

    paid: z.boolean(),
    actualPrice: z.coerce.number().nullable().optional(),
    discountPrice: z.coerce.number().nullable().optional(),

    startDate: z.string().optional(),
    endDate: z.string().optional(),

    schedule: z.array(z.string()).min(1, "Schedule is required"),
    outcomes: z.array(z.string()).min(1, "Outcomes are required"),

    faq: z
      .array(
        z.object({
          question: z.string().min(1, "FAQ question is required"),
          answer: z.string().min(1, "FAQ answer is required"),
        })
      )
      .min(1, "At least one FAQ is required"),

    // Base64 or empty string
    thumbnail_url: z.string().optional(),
    // Plain URL or empty
    video_url: z.string().optional(),

    status: z.enum(["draft", "published", "archived"]).default("draft"),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.endDate) > new Date(data.startDate);
      }
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  )
  .refine(
    (data) => {
      if (data.paid) {
        return data.actualPrice != null && data.discountPrice != null;
      }
      return true;
    },
    {
      message: "Actual price and discount price are required for paid courses",
      path: ["actualPrice"],
    }
  )
  .refine(
    (data) => {
      if (data.paid && data.actualPrice != null && data.discountPrice != null) {
        return data.discountPrice <= data.actualPrice;
      }
      return true;
    },
    {
      message: "Discount price cannot be greater than actual price",
      path: ["discountPrice"],
    }
  );
