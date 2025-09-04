"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PhoneCall, Contact, Contrast, Accessibility, Facebook, Linkedin } from "lucide-react";
import { toast } from "sonner";

interface FooterProps {
  className?: string;
}

export default function Footer({ className }: FooterProps) {
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [contactFormOpen, setContactFormOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "general",
    message: ""
  });

  // Load accessibility preferences
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedContrast = localStorage.getItem("highContrast") === "true";
      const savedLargeText = localStorage.getItem("largeText") === "true";
      setHighContrast(savedContrast);
      setLargeText(savedLargeText);
      
      // Apply preferences to document
      if (savedContrast) document.documentElement.classList.add("high-contrast");
      if (savedLargeText) document.documentElement.classList.add("large-text");
    }
  }, []);

  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    
    if (typeof window !== "undefined") {
      localStorage.setItem("highContrast", newValue.toString());
      document.documentElement.classList.toggle("high-contrast", newValue);
    }
    
    toast.success(newValue ? "High contrast enabled" : "High contrast disabled");
  };

  const toggleLargeText = () => {
    const newValue = !largeText;
    setLargeText(newValue);
    
    if (typeof window !== "undefined") {
      localStorage.setItem("largeText", newValue.toString());
      document.documentElement.classList.toggle("large-text", newValue);
    }
    
    toast.success(newValue ? "Large text enabled" : "Large text disabled");
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
      toast.success("Print dialog opened");
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Message sent successfully! We'll get back to you soon.");
      setContactFormOpen(false);
      setContactForm({ name: "", email: "", subject: "general", message: "" });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    }
  };

  const partners = [
    { name: "Partner 1", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=40&fit=crop&crop=center" },
    { name: "Partner 2", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=40&fit=crop&crop=center" },
    { name: "Partner 3", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=40&fit=crop&crop=center" }
  ];

  return (
    <footer className={`bg-card border-t border-border ${className}`}>
      {/* Main footer content */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Contact & Address */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-foreground">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-muted-foreground" />
                <a href="tel:+1234567890" className="text-foreground hover:text-primary transition-colors">
                  +1 (234) 567-890
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Contact className="w-4 h-4 text-muted-foreground" />
                <a href="mailto:info@example.gov" className="text-foreground hover:text-primary transition-colors">
                  info@example.gov
                </a>
              </div>
              <address className="not-italic text-muted-foreground">
                123 Government Street<br />
                Capital City, ST 12345
              </address>
              <Dialog open={contactFormOpen} onOpenChange={setContactFormOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="mt-2">
                    Contact Form
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Send us a message</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={contactForm.name}
                          onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Select
                        value={contactForm.subject}
                        onValueChange={(value) => setContactForm(prev => ({ ...prev, subject: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="support">Technical Support</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                          <SelectItem value="complaint">Complaint</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        value={contactForm.message}
                        onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                        required
                        rows={4}
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button type="button" variant="outline" onClick={() => setContactFormOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Send Message</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/news" className="text-muted-foreground hover:text-primary transition-colors">News</a></li>
              <li><a href="/guides" className="text-muted-foreground hover:text-primary transition-colors">Guides</a></li>
              <li><a href="/regions" className="text-muted-foreground hover:text-primary transition-colors">Regions</a></li>
              <li><a href="/payments" className="text-muted-foreground hover:text-primary transition-colors">Payments</a></li>
              <li><a href="/debt-check" className="text-muted-foreground hover:text-primary transition-colors">Debt Check</a></li>
            </ul>
          </div>

          {/* Legal & Policy */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-foreground">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="/accessibility" className="text-muted-foreground hover:text-primary transition-colors">Accessibility Statement</a></li>
              <li><a href="/cookies" className="text-muted-foreground hover:text-primary transition-colors">Cookie Policy</a></li>
              <li><a href="/disclaimer" className="text-muted-foreground hover:text-primary transition-colors">Disclaimer</a></li>
            </ul>
          </div>

          {/* Language & Social */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-foreground">Connect</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="language" className="text-sm font-medium">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Follow Us</p>
                <div className="flex gap-2">
                  <a 
                    href="https://facebook.com" 
                    className="p-2 bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
                    aria-label="Follow us on Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a 
                    href="https://linkedin.com" 
                    className="p-2 bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
                    aria-label="Follow us on LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Partner Logos */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm font-medium text-muted-foreground mb-4">Our Partners</p>
          <div className="flex flex-wrap items-center gap-6">
            {partners.map((partner, index) => (
              <img
                key={index}
                src={partner.logo}
                alt={partner.name}
                className="h-10 w-auto opacity-60 hover:opacity-100 transition-opacity"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Utility row */}
      <div className="border-t border-border bg-muted/50">
        <div className="container py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrint}
                className="text-muted-foreground hover:text-foreground"
              >
                Print this page
              </Button>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Accessibility:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleHighContrast}
                  className={`text-muted-foreground hover:text-foreground ${highContrast ? 'bg-secondary' : ''}`}
                  aria-pressed={highContrast}
                >
                  <Contrast className="w-4 h-4 mr-1" />
                  Contrast
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLargeText}
                  className={`text-muted-foreground hover:text-foreground ${largeText ? 'bg-secondary' : ''}`}
                  aria-pressed={largeText}
                >
                  <Accessibility className="w-4 h-4 mr-1" />
                  Large Text
                </Button>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              © 2024 Government Services. All rights reserved. | Print function available on all article pages.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}