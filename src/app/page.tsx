import { Hero } from "@/components/sections/hero"
import { About } from "@/components/sections/about"
import { Experience } from "@/components/sections/experience"
import { Education } from "@/components/sections/education"
import { Certificates } from "@/components/sections/certificates"
import { Projects } from "@/components/sections/projects"
import { Contact } from "@/components/sections/contact"
import prisma from "@/lib/prisma"

// Force dynamic since we have DB data (though standard Next.js caching applies)
export const dynamic = 'force-dynamic'

export default async function Home() {
  const [aboutData, skillsData, experienceData, educationData, certificatesData, projectsData] = await Promise.all([
    prisma.about.findMany({ orderBy: { order: 'asc' } }),
    prisma.skill.findMany({ orderBy: { order: 'asc' } }),
    prisma.experience.findMany({
      orderBy: { order: 'asc' },
      include: { projects: { orderBy: { order: 'asc' } } }
    }),
    prisma.education.findMany({ orderBy: { order: 'asc' } }),
    prisma.certificate.findMany({ orderBy: { order: 'asc' } }),
    prisma.project.findMany({ orderBy: { order: 'asc' } })
  ])

  return (
    <main className="bg-neutral-950 min-h-screen selection:bg-neutral-800 selection:text-white">
      <Hero aboutData={aboutData} />
      <About aboutData={aboutData} skillsData={skillsData} />
      <Experience experienceData={experienceData} />
      <Education educationData={educationData} />
      <Certificates certificatesData={certificatesData} />
      <Projects projectsData={projectsData} />
      <Contact />
    </main>
  )
}
