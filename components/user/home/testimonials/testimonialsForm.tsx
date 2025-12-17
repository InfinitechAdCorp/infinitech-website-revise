"use client"
import { Formik, Form, Field, FieldProps } from "formik"
import * as Yup from "yup"
import { Input, Textarea, Button } from "@heroui/react"
import { LuArrowRight } from "react-icons/lu"

interface TestimonialFormValues {
  name: string
  position: string
  company: string
  rating: number
  message: string
}

const initialValues: TestimonialFormValues = {
  name: "",
  position: "",
  company: "",
  rating: 0,
  message: "",
}

const schema = Yup.object().shape({
  name: Yup.string().trim().required("Name is required"),
  position: Yup.string().trim().required("Position is required"),
  company: Yup.string().trim().required("Company is required"),
  rating: Yup.number().required("Rating is required").min(1, "Please give a rating").max(5, "Maximum rating is 5 stars"),
  message: Yup.string().trim().min(20, "Message must be at least 20 characters").required("Message is required"),
})

const TestimonialForm = () => {
  return (
    <div className="w-full max-w-lg mx-auto py-8 rounded-2xl">
      <h2 className="text-4xl text-primary text-center mb-6 font-['Poetsen_One']">Share Your Experience</h2>
      <p className="mb-6 text-sm text-gray-500">
        We’d love to hear your thoughts! Your feedback helps us grow and inspires others to trust our services.
      </p>

      <Formik<TestimonialFormValues>
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={(values, { resetForm }) => {
          console.log("Submitted:", values)
          resetForm()
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-6">
            {/* NAME */}
            <Field name="name">
              {({ field, meta }: FieldProps) => (
                <div>
                  <Input {...field} type="text" size="lg" label="Full Name" variant="bordered" placeholder="eg. Juan Dela Cruz" />
                  {meta.touched && meta.error && <small className="text-red-500">{meta.error}</small>}
                </div>
              )}
            </Field>

            {/* POSITION */}
            <Field name="position">
              {({ field, meta }: FieldProps) => (
                <div>
                  <Input {...field} type="text" size="lg" label="Position" variant="bordered" placeholder="eg. CEO" />
                  {meta.touched && meta.error && <small className="text-red-500">{meta.error}</small>}
                </div>
              )}
            </Field>

            {/* COMPANY */}
            <Field name="company">
              {({ field, meta }: FieldProps) => (
                <div>
                  <Input {...field} type="text" size="lg" label="Company" variant="bordered" placeholder="eg. Google, Netflix, IBM..." />
                  {meta.touched && meta.error && <small className="text-red-500">{meta.error}</small>}
                </div>
              )}
            </Field>

            {/* RATING */}
            <Field name="rating">
              {({ field, form, meta }: FieldProps) => (
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#52525B]">Rating</label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => form.setFieldValue(field.name, star)}
                        className="focus:outline-none transition-transform duration-200 hover:scale-110 active:scale-95"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill={star <= (field.value || 0) ? "#FFD700" : "#D1D5DB"}
                          className="w-8 h-8 transition-colors duration-300"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.955c.3.922-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.785.57-1.84-.196-1.54-1.118l1.287-3.955a1 1 0 00-.364-1.118L2.075 9.382c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.274-3.955z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                  {meta.touched && meta.error && <small className="text-red-500">{meta.error}</small>}
                </div>
              )}
            </Field>

            {/* MESSAGE */}
            <Field name="message">
              {({ field, meta }: FieldProps) => (
                <div>
                  <Textarea {...field} size="lg" label="Message" variant="bordered" placeholder="Write your testimonial here..." />
                  {meta.touched && meta.error && <small className="text-red-500">{meta.error}</small>}
                </div>
              )}
            </Field>

            {/* SUBMIT */}
            <div>
              <Button
                type="submit"
                className="bg-primary text-gray-100"
                size="lg"
                variant="solid"
                endContent={<LuArrowRight />}
                isLoading={isSubmitting}
              >
                Submit Testimonial
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default TestimonialForm
