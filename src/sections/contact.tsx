"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion, type Variants } from "motion/react";
import { Mail, MessageSquare, Phone, Send } from "lucide-react";
import { useState } from "react";
import { Eyebrow } from "@/components/dossier/eyebrow";
import { GlitchDialog } from "@/components/dossier/glitch-dialog";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.14, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const iconVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

export function ContactFormSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialog, setDialog] = useState<{ open: boolean; variant: "success" | "error" }>({
    open: false,
    variant: "success",
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://formsubmit.co/ajax/vigabriel.darwin@hotmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: "Nuevo mensaje de contacto desde tu Portafolio",
          ...formData,
        }),
      });

      if (response.ok) {
        setDialog({ open: true, variant: "success" });
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        setDialog({ open: true, variant: "error" });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setDialog({ open: true, variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <section id="contacto" className="relative overflow-hidden bg-background px-4 sm:px-8 md:py-28 py-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-6 h-130 w-130 -translate-x-1/2 bg-accent/5 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-90 w-90 bg-primary/5 blur-[130px]" />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 text-center">
        {/* Plain node (no motion transform): the swarm measures and reveals this box. */}
        <div data-build="ENCABEZADO" className="space-y-4">
          <Eyebrow n={8} label="CANAL ABIERTO" className="justify-center" />
          <h2 className="font-display text-3xl uppercase tracking-tight text-foreground md:text-4xl">
            Construyamos algo excepcional juntos
          </h2>
          <p className="max-w-2xl text-foreground/70">
            Comparte los detalles de tu proyecto y me comunicaré contigo dentro de un día hábil. Estoy aquí para colaborar y crear experiencias significativas.
          </p>
        </div>

        <Card data-build="FORMULARIO" className="group relative w-full max-w-4xl overflow-hidden border border-border bg-background/60 p-0 backdrop-blur transition-colors hover:border-accent">
          <div className="absolute inset-0 bg-linear-to-br from-accent/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <motion.form
            onSubmit={handleSubmit}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="relative grid gap-10 px-6 py-8 md:grid-cols-2 md:px-10 md:py-12"
            aria-label="Formulario de contacto"
          >
            <motion.div
              variants={itemVariants}
              className="space-y-8 text-left text-foreground/70"
            >
              <motion.div
                variants={iconVariants}
                className="inline-flex items-center gap-2 border border-border bg-background/50 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-foreground/70 backdrop-blur"
                aria-hidden="true"
              >
                <span className="h-2 w-2 bg-primary/80" />
                Respuesta en 24 horas
              </motion.div>

              <div className="space-y-3">
                <h3 className="font-display text-lg uppercase tracking-tight text-foreground">
                  Cuéntame sobre tu proyecto
                </h3>
                <p className="text-sm text-foreground/70">
                  Podemos agendar una llamada inicial para comprender tus objetivos, plazos y requerimientos. ¿Prefieres el correo? Escríbeme a {" "}
                  <a
                    href="mailto:vigabriel.darwin@hotmail.com"
                    className="text-foreground underline decoration-border/70 underline-offset-4 transition-colors hover:text-accent"
                  >
                    vigabriel.darwin@hotmail.com
                  </a>
                  .
                </p>
              </div>

              <div className="grid gap-4 text-sm text-foreground/70">
                <div className="flex items-start gap-3 rounded-xl border border-border/40 bg-background/40 p-3">
                  <Mail
                    className="mt-0.5 h-4 w-4 text-foreground/60"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">Email</p>
                    <p>vigabriel.darwin@hotmail.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl border border-border/40 bg-background/40 p-3">
                  <Phone
                    className="mt-0.5 h-4 w-4 text-foreground/60"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">Teléfono</p>
                    <p>+59178507750</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-6 text-left">
              <div className="grid gap-4 md:grid-cols-2 items-start">
                <div className="space-y-2 flex flex-col h-full justify-end">
                  <Label
                    htmlFor="name"
                    className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60"
                  >
                    Nombre Completo
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Ej. Juan Pérez"
                    value={formData.name}
                    onChange={handleChange}
                    className="h-10 rounded-xl border border-border/40 bg-background/40 text-sm text-foreground transition-all focus-visible:border-border/60 focus-visible:ring-2 focus-visible:ring-accent/30"
                    aria-required="true"
                    required
                  />
                </div>

                <div className="space-y-2 flex flex-col h-full justify-end">
                  <Label
                    htmlFor="email"
                    className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60"
                  >
                    Correo Electrónico
                  </Label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/50"
                      aria-hidden="true"
                    />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="juan@correo.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="h-10 rounded-xl border border-border/40 bg-background/40 pl-10 text-sm text-foreground transition-all focus-visible:border-border/60 focus-visible:ring-2 focus-visible:ring-accent/30"
                      autoComplete="email"
                      aria-required="true"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60"
                >
                  Número de Teléfono
                </Label>
                <div className="relative">
                  <Phone
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/50"
                    aria-hidden="true"
                  />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+591 77777777 o 77777777"
                    value={formData.phone}
                    onChange={handleChange}
                    className="rounded-xl border border-border/40 bg-background/40 pl-10 text-sm text-foreground transition-all focus-visible:border-border/60 focus-visible:ring-2 focus-visible:ring-accent/30"
                    autoComplete="tel"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="message"
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60"
                >
                  Mensaje
                </Label>
                <div className="relative">
                  <MessageSquare
                    className="absolute left-3 top-3 h-4 w-4 text-foreground/50"
                    aria-hidden="true"
                  />
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Cuéntame sobre tu visión, tiempos y lo que necesitas."
                    value={formData.message}
                    onChange={handleChange}
                    className="min-h-35 rounded-xl border border-border/40 bg-background/40 pl-10 py-3 text-sm text-foreground transition-all focus-visible:border-border/60 focus-visible:ring-2 focus-visible:ring-accent/30"
                    aria-required="true"
                    required
                  />
                </div>
              </div>

              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="group flex w-full items-center justify-center gap-2 bg-primary font-mono uppercase tracking-[0.08em] text-primary-foreground transition-colors hover:bg-accent disabled:opacity-70 disabled:cursor-not-allowed animate-pulse-ring"
                >
                  {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
                  {!isSubmitting && (
                    <Send
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  )}
                </Button>
              </motion.div>
            </motion.div>
          </motion.form>
        </Card>
      </div>

      <GlitchDialog
        open={dialog.open}
        variant={dialog.variant}
        title={dialog.variant === "success" ? "Mensaje enviado" : "Error de envío"}
        message={
          dialog.variant === "success"
            ? "Te contactaré pronto. Gracias por escribirme."
            : "Hubo un problema al enviar el mensaje. Intenta de nuevo o escríbeme directo a vigabriel.darwin@hotmail.com."
        }
        onClose={() => setDialog((d) => ({ ...d, open: false }))}
      />
    </section>
  );
}
