import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const buttonSchema = z.object({
  label: z.string(),
  url: z.string(),
  hoverColor: z.string().optional().default('#ea580c'),
  spacing: z.object({
    mt: z.string().default('0'),
    mr: z.string().default('0'),
    mb: z.string().default('0'),
    ml: z.string().default('0'),
    pt: z.string().default('0.875rem'),
    pr: z.string().default('2rem'),
    pb: z.string().default('0.875rem'),
    pl: z.string().default('2rem'),
  }).optional().default({}),
});

const resume = defineCollection({
	loader: glob({ base: './src/content/resume', pattern: '**/!(config).json' }),
	schema: z.object({
        fullName: z.string().optional(),
        hero: z.object({
            role: z.string(),
            description: z.string(),
            download: z.string(),
        }),
        stats: z.object({
            exp: z.string(),
            automation: z.string(),
            channels: z.string(),
        }),
        sectionTitles: z.object({
            skills: z.string(),
            experience: z.string(),
            contact: z.string(),
        }),
        experiences: z.array(z.object({
            title: z.string(),
            company: z.string(),
            period: z.string(),
            location: z.string(),
            highlights: z.array(z.string()),
            tech: z.array(z.string()),
        })),
        skills: z.array(z.object({
            category: z.string(),
            items: z.array(z.string()),
        })),
        contact: z.object({
            title: z.string(),
            subtitle: z.string(),
            primaryBtn: buttonSchema,
            secondaryBtn: buttonSchema,
        }),
        contactInfo: z.object({
            email: z.string(),
            phone: z.string(),
            address: z.string(),
            linkedin: z.string(),
        }),
    }), 
});

const config = defineCollection({
    loader: glob({ base: './src/content/resume', pattern: 'config.json' }),
    schema: z.object({
        pdfFileName: z.string().optional(),
        startYear: z.number().optional(),
        privateInfo: z.any().optional(),
        theme: z.any().optional(),
    })
});

export const collections = { resume, config };


