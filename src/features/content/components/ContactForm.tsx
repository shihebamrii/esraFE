"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Mail as MailIcon, Phone as PhoneIcon, MapPin as MapPinIcon, Send as SendIcon } from "lucide-react";

export function ContactForm() {
  const t = useTranslations("Contact");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post("/inquiries", formData);

      toast.success(t("success"));
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast.error(t("error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full font-bold tracking-widest uppercase text-xs mb-4 inline-block">
              {t("badge")}
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-[#1f3a5f] mb-6">
              {t("title")}
            </h2>
            <p className="text-lg text-[#1f3a5f]/70 max-w-2xl mx-auto">
              {t("subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-[#fff9e6] p-8 rounded-3xl border border-[#ffcc1a]/20">
                <h3 className="text-xl font-bold text-[#1f3a5f] mb-8">{t("infoTitle")}</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#ffcc1a] flex items-center justify-center text-[#1f3a5f] shrink-0">
                      <MailIcon size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1f3a5f]/50 uppercase tracking-wider">{t("emailLabel")}</p>
                      <p className="text-[#1f3a5f] font-medium">contact@beestory.tn</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#ffcc1a] flex items-center justify-center text-[#1f3a5f] shrink-0">
                      <PhoneIcon size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1f3a5f]/50 uppercase tracking-wider">{t("phoneLabel")}</p>
                      <p className="text-[#1f3a5f] font-medium">+216 20 000 000</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#ffcc1a] flex items-center justify-center text-[#1f3a5f] shrink-0">
                      <MapPinIcon size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1f3a5f]/50 uppercase tracking-wider">{t("addressLabel")}</p>
                      <p className="text-[#1f3a5f] font-medium">{t("address")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-[#1f3a5f]/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#1f3a5f]/70 ml-1">{t("name")}</label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      className="h-12 rounded-xl border-[#1f3a5f]/10 focus:border-[#ffcc1a] focus:ring-[#ffcc1a]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#1f3a5f]/70 ml-1">{t("email")}</label>
                    <Input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      className="h-12 rounded-xl border-[#1f3a5f]/10 focus:border-[#ffcc1a] focus:ring-[#ffcc1a]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#1f3a5f]/70 ml-1">{t("subject")}</label>
                  <Input
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="How can we help?"
                    className="h-12 rounded-xl border-[#1f3a5f]/10 focus:border-[#ffcc1a] focus:ring-[#ffcc1a]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#1f3a5f]/70 ml-1">{t("message")}</label>
                  <Textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Your message here..."
                    className="min-h-[150px] rounded-xl border-[#1f3a5f]/10 focus:border-[#ffcc1a] focus:ring-[#ffcc1a] resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 rounded-xl bg-[#1f3a5f] hover:bg-[#2a4d7d] text-white font-bold text-lg transition-all group"
                >
                  {isSubmitting ? t("sending") : (
                    <>
                      {t("send")}
                      <SendIcon className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={18} />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
