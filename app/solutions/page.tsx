import React from "react"
import { poetsen_one } from "@/config/fonts"
import SolutionsCard from "@/components/user/home/solutions/solutionscard"
import SurveyForm from "@/components/survey-form"

const Page = () => {
  return (
    <section className="container mx-auto py-12 px-4">
      <div className="flex flex-col justify-center items-center">
        <div className="flex justify-between">
          <div className="max-w-2xl text-center">
            <h1 className="text-4xl text-accent font-bold mt-12">SOLUTIONS</h1>
            <h1 className={`text-3xl text-primary ${poetsen_one.className}`}>We design & build your custom website</h1>
          </div>
        </div>

        <div>
          <SolutionsCard />
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h1 className={`text-4xl text-primary mt-12 font-['Poetsen_One']`}>Client Discovery Survey</h1>
                <h2 className="text-sm sm:text-base lg:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed animate-fade-in-up mb-8 sm:mb-12 px-4">
                  Help us understand your needs so we can deliver the perfect solution
                </h2>
              </div>

              <SurveyForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Page
