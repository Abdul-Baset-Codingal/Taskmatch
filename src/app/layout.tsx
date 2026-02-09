// import type { Metadata } from "next";
// import "./globals.css";
// import { Providers } from "./Providers";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import favIcon from "../../public/Images/favicon.ico";
// import Script from "next/script";
// import GlobalMessengerWrapper from "@/components/browse-tasks/GlobalMessengerWrapper";

// // Your GTM ID
// const GTM_ID = "GTM-NS5FD44F";

// export const metadata: Metadata = {
//   title: "Taskallo - Canada's Most Reliable Task & Service Marketplace",
//   description: "Post a task, request quotes, or choose ready-to-book services across Canada. Find trusted professionals for handyman services, pet care, cleaning, plumbing, electrical, HVAC, automotive repairs, and specialized services. Simple, transparent, and proudly Canadian.",
//   keywords: [
//     "Canadian task marketplace",
//     "home services Canada",
//     "handyman services",
//     "pet services",
//     "cleaning services",
//     "plumbing services",
//     "electrical services",
//     "HVAC services",
//     "automotive services",
//     "professional taskers Canada",
//     "book services online",
//     "request quotes",
//     "home repairs",
//     "furniture assembly",
//     "dog walking",
//     "pet sitting",
//     "deep cleaning",
//     "move-in cleaning",
//     "brake repair",
//     "oil change",
//     "specialized services"
//   ],
//   authors: [{ name: "Taskallo" }],
//   creator: "Taskallo",
//   publisher: "Taskallo",
//   formatDetection: {
//     email: false,
//     address: false,
//     telephone: false,
//   },
//   metadataBase: new URL("https://www.taskallo.com"),
//   alternates: {
//     canonical: "/",
//   },
//   openGraph: {
//     type: "website",
//     locale: "en_CA",
//     url: "https://www.taskallo.com",
//     title: "Taskallo - Canada's Most Reliable Task & Service Marketplace",
//     description: "Post a task, request quotes, or choose ready-to-book services. Connect with professional Taskers for home services, pet care, cleaning, repairs, and more. Simple, transparent, and proudly Canadian.",
//     siteName: "Taskallo",
//     images: [
//       {
//         url: "/og-image.png",
//         width: 1200,
//         height: 630,
//         alt: "Taskallo - Canada's Task & Service Marketplace",
//       },
//     ],
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "Taskallo - Canada's Most Reliable Task & Service Marketplace",
//     description: "Post a task, request quotes, or choose ready-to-book services across Canada. Connect with trusted professionals for all your home and specialized service needs.",
//     images: ["/og-image.png"],
//   },
//   robots: {
//     index: true,
//     follow: true,
//     googleBot: {
//       index: true,
//       follow: true,
//       "max-video-preview": -1,
//       "max-image-preview": "large",
//       "max-snippet": -1,
//     },
//   },
//   icons: {
//     icon: favIcon.src,
//     shortcut: favIcon.src,
//     apple: favIcon.src,
//   },
//   verification: {
//     google: "IA5Wqn6USCMXxWfq1ik3n2Of_4WAvpcT770xD81d3ws",
//   },
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <head>
//         {/* Additional SEO meta tags */}
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <meta name="theme-color" content="#ffffff" />
//         <link rel="canonical" href="https://www.taskallo.com" />

//         {/* 1. Google Tag Manager (Loads GTM) */}
//         <Script id="gtm" strategy="afterInteractive">
//           {`
//             (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
//             new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
//             j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
//             'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
//             })(window,document,'script','dataLayer','${GTM_ID}');
//           `}
//         </Script>

//         {/* 2. Marketplace Tracking (Tracks "Start" events automatically) */}
//         <Script id="marketplace-tracking" strategy="afterInteractive">
//           {`
//             window.dataLayer = window.dataLayer || [];
//             var path = window.location.pathname;
            
//             // Track when user starts posting a task
//             if (path === '/urgent-task') {
//               window.dataLayer.push({ event: 'post_task_start' });
//             }
            
//             // Track when user starts browsing tasks
//             if (path.startsWith('/browse-tasks')) {
//               window.dataLayer.push({ event: 'browse_tasks_start' });
//             }
//           `}
//         </Script>
//       </head>

//       {/* Microsoft Clarity */}
//       <Script id="microsoft-clarity" strategy="afterInteractive">
//         {`
//           (function(c,l,a,r,i,t,y){
//             c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
//             t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
//             y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
//           })(window, document, "clarity", "script", "usifz7pkwr");
//         `}
//       </Script>

//       {/* Structured Data - Organization */}
//       <Script id="structured-data-organization" type="application/ld+json">
//         {JSON.stringify({
//           "@context": "https://schema.org",
//           "@type": "Organization",
//           name: "Taskallo",
//           url: "https://www.taskallo.com",
//           logo: "https://www.taskallo.com/logo.png",
//           description: "Canada's most reliable task and service marketplace connecting clients with professional Taskers for home services, repairs, and specialized tasks.",
//           address: {
//             "@type": "PostalAddress",
//             addressCountry: "CA"
//           },
//           areaServed: "CA"
//         })}
//       </Script>

//       {/* Structured Data - Website */}
//       <Script id="structured-data-website" type="application/ld+json">
//         {JSON.stringify({
//           "@context": "https://schema.org",
//           "@type": "WebSite",
//           name: "Taskallo",
//           url: "https://www.taskallo.com",
//           description: "Canada's most reliable task and service marketplace. Post tasks, request quotes, or book ready-to-go services from trusted professionals.",
//           potentialAction: {
//             "@type": "SearchAction",
//             target: "https://www.taskallo.com/search?q={search_term_string}",
//             "query-input": "required name=search_term_string"
//           }
//         })}
//       </Script>

//       {/* Structured Data - Services */}
//       <Script id="structured-data-services" type="application/ld+json">
//         {JSON.stringify({
//           "@context": "https://schema.org",
//           "@type": "Service",
//           serviceType: "Task and Service Marketplace",
//           provider: {
//             "@type": "Organization",
//             name: "Taskallo"
//           },
//           areaServed: {
//             "@type": "Country",
//             name: "Canada"
//           },
//           hasOfferCatalog: {
//             "@type": "OfferCatalog",
//             name: "Taskallo Services",
//             itemListElement: [
//               {
//                 "@type": "Offer",
//                 itemOffered: {
//                   "@type": "Service",
//                   name: "Handyman & Home Repairs",
//                   description: "Small fixes, furniture assembly, painting, drywall, flooring, small renovations, and moving labor."
//                 }
//               },
//               {
//                 "@type": "Offer",
//                 itemOffered: {
//                   "@type": "Service",
//                   name: "Pet Services",
//                   description: "Walking, sitting, boarding, and grooming — offering all-in-one, trusted services to give your pet the love and care they deserve."
//                 }
//               },
//               {
//                 "@type": "Offer",
//                 itemOffered: {
//                   "@type": "Service",
//                   name: "Cleaning Services",
//                   description: "Standard, deep, and move-in/move-out cleaning — comprehensive, professional care that transforms your space with a flawless shine."
//                 }
//               },
//               {
//                 "@type": "Offer",
//                 itemOffered: {
//                   "@type": "Service",
//                   name: "Plumbing, Electrical & HVAC",
//                   description: "Plumbing, Electrical, Furnace/AC install & repair, Emergency services."
//                 }
//               },
//               {
//                 "@type": "Offer",
//                 itemOffered: {
//                   "@type": "Service",
//                   name: "Automotive Services",
//                   description: "Find reliable mechanics for oil changes, tire services, brake repairs, and other car maintenance."
//                 }
//               }
//             ]
//           }
//         })}
//       </Script>

//       <body className="antialiased">
//         {/* Google Tag Manager (noscript) - Must be first in body */}
//         <noscript>
//           <iframe
//             src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
//             height="0"
//             width="0"
//             style={{ display: "none", visibility: "hidden" }}
//           />
//         </noscript>

//         <Providers>
//           {children}
//           <ToastContainer
//             position="top-center"
//             autoClose={3000}
//             style={{ zIndex: 999999 }}
//           />
//           {/* <GlobalMessengerWrapper /> */}
//         </Providers>
//       </body>
//     </html>
//   );
// }


import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./Providers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import favIcon from "../../public/Images/favicon.ico";
import Script from "next/script";
import GlobalMessengerWrapper from "@/components/browse-tasks/GlobalMessengerWrapper";

// Your GTM ID
const GTM_ID = "GTM-NS5FD44F";

// Your Meta Pixel ID
const META_PIXEL_ID = "2312460462570511";

export const metadata: Metadata = {
  title: "Taskallo - Canada's Most Reliable Task & Service Marketplace",
  description: "Post a task, request quotes, or choose ready-to-book services across Canada. Find trusted professionals for handyman services, pet care, cleaning, plumbing, electrical, HVAC, automotive repairs, and specialized services. Simple, transparent, and proudly Canadian.",
  keywords: [
    "Canadian task marketplace",
    "home services Canada",
    "handyman services",
    "pet services",
    "cleaning services",
    "plumbing services",
    "electrical services",
    "HVAC services",
    "automotive services",
    "professional taskers Canada",
    "book services online",
    "request quotes",
    "home repairs",
    "furniture assembly",
    "dog walking",
    "pet sitting",
    "deep cleaning",
    "move-in cleaning",
    "brake repair",
    "oil change",
    "specialized services"
  ],
  authors: [{ name: "Taskallo" }],
  creator: "Taskallo",
  publisher: "Taskallo",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.taskallo.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "https://www.taskallo.com",
    title: "Taskallo - Canada's Most Reliable Task & Service Marketplace",
    description: "Post a task, request quotes, or choose ready-to-book services. Connect with professional Taskers for home services, pet care, cleaning, repairs, and more. Simple, transparent, and proudly Canadian.",
    siteName: "Taskallo",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Taskallo - Canada's Task & Service Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Taskallo - Canada's Most Reliable Task & Service Marketplace",
    description: "Post a task, request quotes, or choose ready-to-book services across Canada. Connect with trusted professionals for all your home and specialized service needs.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: favIcon.src,
    shortcut: favIcon.src,
    apple: favIcon.src,
  },
  verification: {
    google: "IA5Wqn6USCMXxWfq1ik3n2Of_4WAvpcT770xD81d3ws",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Additional SEO meta tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="canonical" href="https://www.taskallo.com" />

        {/* 1. Google Tag Manager (Loads GTM) */}
        <Script id="gtm" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `}
        </Script>

        {/* 2. Meta Pixel Code */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>

        {/* 3. Marketplace Tracking (Tracks "Start" events automatically) */}
        <Script id="marketplace-tracking" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            var path = window.location.pathname;
            
            // Track when user starts posting a task
            if (path === '/urgent-task') {
              window.dataLayer.push({ event: 'post_task_start' });
            }
            
            // Track when user starts browsing tasks
            if (path.startsWith('/browse-tasks')) {
              window.dataLayer.push({ event: 'browse_tasks_start' });
            }
          `}
        </Script>
      </head>

      {/* Microsoft Clarity */}
      <Script id="microsoft-clarity" strategy="afterInteractive">
        {`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "usifz7pkwr");
        `}
      </Script>

      {/* Structured Data - Organization */}
      <Script id="structured-data-organization" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Taskallo",
          url: "https://www.taskallo.com",
          logo: "https://www.taskallo.com/logo.png",
          description: "Canada's most reliable task and service marketplace connecting clients with professional Taskers for home services, repairs, and specialized tasks.",
          address: {
            "@type": "PostalAddress",
            addressCountry: "CA"
          },
          areaServed: "CA"
        })}
      </Script>

      {/* Structured Data - Website */}
      <Script id="structured-data-website" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Taskallo",
          url: "https://www.taskallo.com",
          description: "Canada's most reliable task and service marketplace. Post tasks, request quotes, or book ready-to-go services from trusted professionals.",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://www.taskallo.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })}
      </Script>

      {/* Structured Data - Services */}
      <Script id="structured-data-services" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Task and Service Marketplace",
          provider: {
            "@type": "Organization",
            name: "Taskallo"
          },
          areaServed: {
            "@type": "Country",
            name: "Canada"
          },
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Taskallo Services",
            itemListElement: [
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Handyman & Home Repairs",
                  description: "Small fixes, furniture assembly, painting, drywall, flooring, small renovations, and moving labor."
                }
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Pet Services",
                  description: "Walking, sitting, boarding, and grooming — offering all-in-one, trusted services to give your pet the love and care they deserve."
                }
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Cleaning Services",
                  description: "Standard, deep, and move-in/move-out cleaning — comprehensive, professional care that transforms your space with a flawless shine."
                }
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Plumbing, Electrical & HVAC",
                  description: "Plumbing, Electrical, Furnace/AC install & repair, Emergency services."
                }
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Automotive Services",
                  description: "Find reliable mechanics for oil changes, tire services, brake repairs, and other car maintenance."
                }
              }
            ]
          }
        })}
      </Script>

      <body className="antialiased">
        {/* Google Tag Manager (noscript) - Must be first in body */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {/* Meta Pixel (noscript) */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>

        <Providers>
          {children}
          <ToastContainer
            position="top-center"
            autoClose={3000}
            style={{ zIndex: 999999 }}
          />
          {/* <GlobalMessengerWrapper /> */}
        </Providers>
      </body>
    </html>
  );
}