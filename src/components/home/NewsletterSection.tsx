
import React from 'react';

export const NewsletterSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center animate-slide-up">
          <h2 className="text-3xl font-medium tracking-tight mb-4">
            Stay Updated
          </h2>
          <p className="text-primary/80 mb-8">
            Subscribe to receive updates on new products, exclusive offers, and inspiration.
          </p>
          
          <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            />
            <button
              type="submit"
              className="btn-hover inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Subscribe
            </button>
          </form>
          <p className="text-xs text-primary/60 mt-4">
            By subscribing, you agree to our Privacy Policy and consent to receive updates.
          </p>
        </div>
      </div>
    </section>
  );
};
