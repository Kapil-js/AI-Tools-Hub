"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  User,
  Download,
  Plus,
  Trash2,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function ResumeBuilder() {
  const { user } = useAuth();
  const router = useRouter();

  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
  });

  const [experiences, setExperiences] = useState([
    { company: "", position: "", duration: "", description: "" },
  ]);

  const [education, setEducation] = useState([
    { school: "", degree: "", year: "", gpa: "" },
  ]);

  const addExperience = () => {
    setExperiences([
      ...experiences,
      { company: "", position: "", duration: "", description: "" },
    ]);
  };

  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const addEducation = () => {
    setEducation([...education, { school: "", degree: "", year: "", gpa: "" }]);
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Tool Description */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Professional Resume Builder
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Create a professional resume with AI-powered suggestions and
              modern templates
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="space-y-6">
              {/* Personal Information */}
              <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Basic details about yourself
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={personalInfo.name}
                        onChange={(e) =>
                          setPersonalInfo({
                            ...personalInfo,
                            name: e.target.value,
                          })
                        }
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={personalInfo.email}
                        onChange={(e) =>
                          setPersonalInfo({
                            ...personalInfo,
                            email: e.target.value,
                          })
                        }
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={personalInfo.phone}
                        onChange={(e) =>
                          setPersonalInfo({
                            ...personalInfo,
                            phone: e.target.value,
                          })
                        }
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={personalInfo.location}
                        onChange={(e) =>
                          setPersonalInfo({
                            ...personalInfo,
                            location: e.target.value,
                          })
                        }
                        placeholder="New York, NY"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="summary">Professional Summary</Label>
                    <Textarea
                      id="summary"
                      value={personalInfo.summary}
                      onChange={(e) =>
                        setPersonalInfo({
                          ...personalInfo,
                          summary: e.target.value,
                        })
                      }
                      placeholder="Brief overview of your experience and goals..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Experience */}
              <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Briefcase className="w-5 h-5 mr-2" />
                      Work Experience
                    </div>
                    <Button size="sm" onClick={addExperience}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Your professional experience
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {experiences.map((exp, index) => (
                    <div key={index} className="border rounded-lg p-4 relative">
                      {experiences.length > 1 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-2 right-2"
                          onClick={() => removeExperience(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label>Company</Label>
                          <Input
                            value={exp.company}
                            onChange={(e) => {
                              const newExps = [...experiences];
                              newExps[index].company = e.target.value;
                              setExperiences(newExps);
                            }}
                            placeholder="Company Name"
                          />
                        </div>
                        <div>
                          <Label>Position</Label>
                          <Input
                            value={exp.position}
                            onChange={(e) => {
                              const newExps = [...experiences];
                              newExps[index].position = e.target.value;
                              setExperiences(newExps);
                            }}
                            placeholder="Job Title"
                          />
                        </div>
                      </div>
                      <div className="mb-4">
                        <Label>Duration</Label>
                        <Input
                          value={exp.duration}
                          onChange={(e) => {
                            const newExps = [...experiences];
                            newExps[index].duration = e.target.value;
                            setExperiences(newExps);
                          }}
                          placeholder="Jan 2020 - Dec 2022"
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={exp.description}
                          onChange={(e) => {
                            const newExps = [...experiences];
                            newExps[index].description = e.target.value;
                            setExperiences(newExps);
                          }}
                          placeholder="Describe your responsibilities and achievements..."
                          rows={3}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Education */}
              <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <GraduationCap className="w-5 h-5 mr-2" />
                      Education
                    </div>
                    <Button size="sm" onClick={addEducation}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </CardTitle>
                  <CardDescription>Your educational background</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {education.map((edu, index) => (
                    <div key={index} className="border rounded-lg p-4 relative">
                      {education.length > 1 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-2 right-2"
                          onClick={() => removeEducation(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>School</Label>
                          <Input
                            value={edu.school}
                            onChange={(e) => {
                              const newEdu = [...education];
                              newEdu[index].school = e.target.value;
                              setEducation(newEdu);
                            }}
                            placeholder="University Name"
                          />
                        </div>
                        <div>
                          <Label>Degree</Label>
                          <Input
                            value={edu.degree}
                            onChange={(e) => {
                              const newEdu = [...education];
                              newEdu[index].degree = e.target.value;
                              setEducation(newEdu);
                            }}
                            placeholder="Bachelor of Science"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <Label>Year</Label>
                          <Input
                            value={edu.year}
                            onChange={(e) => {
                              const newEdu = [...education];
                              newEdu[index].year = e.target.value;
                              setEducation(newEdu);
                            }}
                            placeholder="2020"
                          />
                        </div>
                        <div>
                          <Label>GPA (Optional)</Label>
                          <Input
                            value={edu.gpa}
                            onChange={(e) => {
                              const newEdu = [...education];
                              newEdu[index].gpa = e.target.value;
                              setEducation(newEdu);
                            }}
                            placeholder="3.8"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Preview Section */}
            <div className="lg:sticky lg:top-4">
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Resume Preview
                    <Button
                      className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                      onClick={() => {
                        if (!user) {
                          router.push(`/auth?redirect=${encodeURIComponent(window.location.pathname)}`);
                          return;
                        }
                        // Download functionality would go here
                        alert("Resume download started!");
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-white border rounded-lg p-6 min-h-[600px]">
                    {/* Resume Preview Content */}
                    <div className="space-y-6">
                      {/* Header */}
                      <div className="text-center border-b pb-4">
                        <h1 className="text-2xl font-bold text-slate-900">
                          {personalInfo.name || "Your Name"}
                        </h1>
                        <div className="text-sm text-slate-600 mt-2 space-y-1">
                          {personalInfo.email && <p>{personalInfo.email}</p>}
                          {personalInfo.phone && <p>{personalInfo.phone}</p>}
                          {personalInfo.location && (
                            <p>{personalInfo.location}</p>
                          )}
                        </div>
                      </div>

                      {/* Summary */}
                      {personalInfo.summary && (
                        <div>
                          <h2 className="font-bold text-slate-900 mb-2">
                            SUMMARY
                          </h2>
                          <p className="text-sm text-slate-700">
                            {personalInfo.summary}
                          </p>
                        </div>
                      )}

                      {/* Experience */}
                      {experiences.some(
                        (exp) => exp.company || exp.position
                      ) && (
                        <div>
                          <h2 className="font-bold text-slate-900 mb-3">
                            EXPERIENCE
                          </h2>
                          <div className="space-y-3">
                            {experiences
                              .filter((exp) => exp.company || exp.position)
                              .map((exp, index) => (
                                <div key={index}>
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h3 className="font-semibold text-slate-900">
                                        {exp.position || "Position"}
                                      </h3>
                                      <p className="text-sm text-slate-600">
                                        {exp.company || "Company"}
                                      </p>
                                    </div>
                                    <p className="text-sm text-slate-500">
                                      {exp.duration}
                                    </p>
                                  </div>
                                  {exp.description && (
                                    <p className="text-sm text-slate-700 mt-1">
                                      {exp.description}
                                    </p>
                                  )}
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* Education */}
                      {education.some((edu) => edu.school || edu.degree) && (
                        <div>
                          <h2 className="font-bold text-slate-900 mb-3">
                            EDUCATION
                          </h2>
                          <div className="space-y-2">
                            {education
                              .filter((edu) => edu.school || edu.degree)
                              .map((edu, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between items-start"
                                >
                                  <div>
                                    <h3 className="font-semibold text-slate-900">
                                      {edu.degree || "Degree"}
                                    </h3>
                                    <p className="text-sm text-slate-600">
                                      {edu.school || "School"}
                                    </p>
                                  </div>
                                  <div className="text-right text-sm text-slate-500">
                                    {edu.year && <p>{edu.year}</p>}
                                    {edu.gpa && <p>GPA: {edu.gpa}</p>}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
