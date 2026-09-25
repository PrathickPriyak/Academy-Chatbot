import { CourseLevel, PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  await db.course.deleteMany();
  await db.category.deleteMany();
  await db.instructor.deleteMany();

  const development = await db.category.create({
    data: {
      name: "Development",
      slug: "development",
      description: "Software engineering programs for building and shipping products.",
    },
  });
  const data = await db.category.create({
    data: {
      name: "Data",
      slug: "data",
      description: "Analysis and decision-making with structured data.",
    },
  });
  const design = await db.category.create({
    data: {
      name: "Design",
      slug: "design",
      description: "Product design, interface craft, and research.",
    },
  });
  const marketing = await db.category.create({
    data: {
      name: "Marketing",
      slug: "marketing",
      description: "Campaign planning and measurement.",
    },
  });
  const cloud = await db.category.create({
    data: {
      name: "Cloud",
      slug: "cloud",
      description: "Deployment, delivery, and operations.",
    },
  });

  const meera = await db.instructor.create({
    data: {
      name: "Meera Krishnan",
      title: "Lead Full Stack Instructor",
      bio: "Meera has shipped product teams at two Indian SaaS companies and teaches web architecture at Infozub.",
    },
  });
  const arjun = await db.instructor.create({
    data: {
      name: "Arjun Shah",
      title: "Data Analytics Faculty",
      bio: "Arjun leads analytics training and previously built reporting systems for retail and education teams.",
    },
  });
  const lina = await db.instructor.create({
    data: {
      name: "Lina D'Souza",
      title: "Product Design Faculty",
      bio: "Lina designs learning products and coaches students through research, prototyping, and critique.",
    },
  });
  const rahul = await db.instructor.create({
    data: {
      name: "Rahul Menon",
      title: "Marketing Faculty",
      bio: "Rahul plans acquisition programs and teaches students how to tie spend to measurable outcomes.",
    },
  });
  const nisha = await db.instructor.create({
    data: {
      name: "Nisha Iyer",
      title: "Cloud Faculty",
      bio: "Nisha operates production services and teaches the delivery path from repository to cloud.",
    },
  });

  await db.course.create({
    data: {
      title: "Full Stack Web Development",
      slug: "full-stack-web-development",
      shortDescription:
        "Build production web applications with React, Next.js, Node.js, and PostgreSQL.",
      description:
        "A 24-week intermediate program for people who want to design, build, and deploy a complete web product. Students work in live studios and finish with a reviewed capstone.",
      thumbnail:
        "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=1200&q=80",
      level: CourseLevel.INTERMEDIATE,
      duration: "24 weeks",
      price: 84000,
      enrollmentUrl: "https://infozub.academy/enroll/full-stack-web-development",
      published: true,
      categoryId: development.id,
      instructorId: meera.id,
      features: {
        create: [
          {
            title: "Live studios",
            description: "Three instructor-led sessions each week.",
          },
          {
            title: "Capstone review",
            description: "Present a full-stack product to a faculty panel.",
          },
          {
            title: "Installments",
            description: "Pay ₹84,000 in three installments.",
          },
        ],
      },
      resources: {
        create: [
          {
            title: "Program outline",
            url: "https://infozub.academy/resources/full-stack-outline",
            kind: "outline",
          },
        ],
      },
      faqs: {
        create: [
          {
            question: "Who is this course for?",
            answer:
              "People who can already write basic programs and want to build complete web applications.",
            position: 1,
          },
          {
            question: "What is the next start date?",
            answer: "The next cohort starts on 6 October 2026.",
            position: 2,
          },
        ],
      },
      modules: {
        create: [
          {
            title: "Interface foundations",
            description: "Markup, TypeScript, layout, and accessibility.",
            position: 1,
            lessons: {
              create: [
                {
                  title: "Semantic HTML and CSS",
                  summary: "Structure pages and style them for small and large screens.",
                  duration: "2 weeks",
                  position: 1,
                },
                {
                  title: "TypeScript essentials",
                  summary: "Model data and catch mistakes before runtime.",
                  duration: "2 weeks",
                  position: 2,
                },
              ],
            },
          },
          {
            title: "React and Next.js",
            description: "Components, routing, and forms.",
            position: 2,
            lessons: {
              create: [
                {
                  title: "Component design",
                  summary: "Build reusable interface pieces with clear props.",
                  duration: "3 weeks",
                  position: 1,
                },
                {
                  title: "App Router",
                  summary: "Organize pages, layouts, and server rendering.",
                  duration: "3 weeks",
                  position: 2,
                },
              ],
            },
          },
          {
            title: "Backend and data",
            description: "APIs, PostgreSQL, and authentication.",
            position: 3,
            lessons: {
              create: [
                {
                  title: "API routes",
                  summary: "Validate input and return structured responses.",
                  duration: "3 weeks",
                  position: 1,
                },
                {
                  title: "PostgreSQL with Prisma",
                  summary: "Model courses, users, and relationships.",
                  duration: "3 weeks",
                  position: 2,
                },
              ],
            },
          },
        ],
      },
    },
  });

  await db.course.create({
    data: {
      title: "Data Analytics with Python",
      slug: "data-analytics-with-python",
      shortDescription:
        "Analyze business data with Python, SQL, and clear visual storytelling.",
      description:
        "A 16-week beginner program for analysts who need to clean data, query it, and explain findings to a team.",
      thumbnail:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      level: CourseLevel.BEGINNER,
      duration: "16 weeks",
      price: 62000,
      enrollmentUrl: "https://infozub.academy/enroll/data-analytics-with-python",
      published: true,
      categoryId: data.id,
      instructorId: arjun.id,
      features: {
        create: [
          { title: "Weekend intensive", description: "Live classes on weekends." },
          {
            title: "Portfolio report",
            description: "Finish with a written findings report.",
          },
        ],
      },
      resources: {
        create: [
          {
            title: "Sample dataset guide",
            url: "https://infozub.academy/resources/analytics-dataset",
            kind: "guide",
          },
        ],
      },
      faqs: {
        create: [
          {
            question: "Do I need prior Python experience?",
            answer: "No. The first module teaches the Python needed for analysis.",
            position: 1,
          },
        ],
      },
      modules: {
        create: [
          {
            title: "Analytics toolkit",
            description: "Python, pandas, and data quality.",
            position: 1,
            lessons: {
              create: [
                {
                  title: "Python for tables",
                  summary: "Load, filter, and summarize tabular data.",
                  duration: "4 weeks",
                  position: 1,
                },
              ],
            },
          },
          {
            title: "SQL",
            description: "Query PostgreSQL with joins and aggregates.",
            position: 2,
            lessons: {
              create: [
                {
                  title: "Joins and aggregates",
                  summary: "Answer business questions with SQL.",
                  duration: "4 weeks",
                  position: 1,
                },
              ],
            },
          },
        ],
      },
    },
  });

  await db.course.create({
    data: {
      title: "UI/UX Product Design",
      slug: "ui-ux-product-design",
      shortDescription:
        "Design clear product interfaces from research through a tested prototype.",
      description:
        "A 12-week studio for new designers. Students interview users, design flows, and test a prototype.",
      thumbnail:
        "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=1200&q=80",
      level: CourseLevel.BEGINNER,
      duration: "12 weeks",
      price: 48000,
      enrollmentUrl: "https://infozub.academy/enroll/ui-ux-product-design",
      published: true,
      categoryId: design.id,
      instructorId: lina.id,
      features: {
        create: [
          {
            title: "Studio critiques",
            description: "Weekly feedback on work in progress.",
          },
        ],
      },
      resources: {
        create: [
          {
            title: "Critique checklist",
            url: "https://infozub.academy/resources/design-critique",
            kind: "checklist",
          },
        ],
      },
      faqs: {
        create: [
          {
            question: "Which tool is used?",
            answer: "Students prototype in Figma.",
            position: 1,
          },
        ],
      },
      modules: {
        create: [
          {
            title: "Research",
            description: "Frame a problem and talk to users.",
            position: 1,
            lessons: {
              create: [
                {
                  title: "Interview practice",
                  summary: "Plan and run a short discovery interview.",
                  duration: "3 weeks",
                  position: 1,
                },
              ],
            },
          },
          {
            title: "Interface craft",
            description: "Typography, color, layout, and components.",
            position: 2,
            lessons: {
              create: [
                {
                  title: "Visual hierarchy",
                  summary: "Make screens easy to scan.",
                  duration: "4 weeks",
                  position: 1,
                },
              ],
            },
          },
        ],
      },
    },
  });

  await db.course.create({
    data: {
      title: "Digital Marketing",
      slug: "digital-marketing",
      shortDescription:
        "Plan campaigns across search, content, and paid channels with measurable goals.",
      description:
        "A 12-week evening batch covering audience, offers, channels, and reporting.",
      thumbnail:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
      level: CourseLevel.BEGINNER,
      duration: "12 weeks",
      price: 42000,
      enrollmentUrl: "https://infozub.academy/enroll/digital-marketing",
      published: true,
      categoryId: marketing.id,
      instructorId: rahul.id,
      features: {
        create: [
          { title: "Campaign brief", description: "Leave with a budgeted channel plan." },
        ],
      },
      resources: {
        create: [
          {
            title: "Metrics worksheet",
            url: "https://infozub.academy/resources/marketing-metrics",
            kind: "worksheet",
          },
        ],
      },
      faqs: {
        create: [
          {
            question: "Is this only about social ads?",
            answer: "No. The course covers search, content, email, and paid social.",
            position: 1,
          },
        ],
      },
      modules: {
        create: [
          {
            title: "Channels",
            description: "Search, content, email, and paid social.",
            position: 1,
            lessons: {
              create: [
                {
                  title: "Offer and funnel",
                  summary: "Define who the campaign is for and what they should do.",
                  duration: "4 weeks",
                  position: 1,
                },
              ],
            },
          },
        ],
      },
    },
  });

  await db.course.create({
    data: {
      title: "Cloud and DevOps Foundations",
      slug: "cloud-and-devops",
      shortDescription:
        "Deploy and operate web applications with cloud services, containers, and CI.",
      description:
        "A 16-week advanced course for developers who need to ship and look after an application.",
      thumbnail:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
      level: CourseLevel.ADVANCED,
      duration: "16 weeks",
      price: 76000,
      enrollmentUrl: "https://infozub.academy/enroll/cloud-and-devops",
      published: false,
      categoryId: cloud.id,
      instructorId: nisha.id,
      features: {
        create: [
          {
            title: "Incident lab",
            description: "Practice reading logs during a staged incident.",
          },
        ],
      },
      resources: {
        create: [
          {
            title: "Lab checklist",
            url: "https://infozub.academy/resources/cloud-lab",
            kind: "checklist",
          },
        ],
      },
      faqs: {
        create: [
          {
            question: "Is this course published?",
            answer:
              "The next cohort is being prepared and is not open for public enrollment yet.",
            position: 1,
          },
        ],
      },
      modules: {
        create: [
          {
            title: "Delivery",
            description: "Containers and continuous integration.",
            position: 1,
            lessons: {
              create: [
                {
                  title: "Container basics",
                  summary:
                    "Package an application so it runs the same in each environment.",
                  duration: "4 weeks",
                  position: 1,
                },
              ],
            },
          },
        ],
      },
    },
  });
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await db.$disconnect();
    process.exit(1);
  });
