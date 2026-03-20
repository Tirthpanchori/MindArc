import React from "react";

const TESTIMONIALS = [
  {
    name: "Alex Rivera",
    role: "Frontend Developer",
    content: "MindArc completely transformed how I approach learning. It's direct, focused, and incredibly effective."
  },
  {
    name: "Sarah Chen",
    role: "Data Scientist",
    content: "The analytics are next level. I can actually see where I'm improving day by day without any of the usual gamified noise."
  },
  {
    name: "James Wilson",
    role: "Student",
    content: "Finally, a platform that respects my time. Structured perfectly."
  }
];

const Testimonials = () => {
  return (
    <section className="py-32 bg-[#0f1117]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Trusted by professionals.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="flex flex-col border-t-2 border-[#1a1d27] pt-8 mt-2">
              <p className="text-xl text-[#9CA3AF] mb-8 leading-relaxed">
                "{t.content}"
              </p>
              <div className="mt-auto">
                <h4 className="text-white font-bold">{t.name}</h4>
                <p className="text-sm text-[#F59E0B] mt-1">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
