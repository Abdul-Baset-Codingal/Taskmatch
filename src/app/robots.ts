// app/robots.ts

import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/*',                      
                    '/complete-tasker-profile',  
                    '/authentication',           
                    '/dashboard/*',              
                    '/admin/*',                   
                    '/user/*',                   
                    '/*?*',                      
                ],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: [
                    '/api/*',
                    '/complete-tasker-profile',
                    '/authentication',
                ],
            },
        ],
        sitemap: 'https://www.taskallo.com/sitemap.xml',
    }
}

