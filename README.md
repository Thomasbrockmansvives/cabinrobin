
README
==========

Project Information:
--------------------
Building a website for a professional photographer, with Html, Css, Javascript and some integrations from Pictime, Whatsapp, ...



0. Content
-----------
   1. Owner and Developer
   2. Structure
   3. Bootstrap
   4. Styling
   5. Images
   6. Navigation
   7. Translations
   8. Reviews
   9. Whatsapp-integration
   


1. Owner and Developer
-----------------------
   Owner of this website: Cabin Robin
   Developer of this website: Thomas Brockmans


2. Structure
-------------
   The folder-structure of the website is as follows:
   There is a common folder which holds bootstrap (which is common or shared for all pages), as well as sitestyling css shared by all pages,
   images shared by all pages and json and javascript shared by all pages.
   There is also a folder specific for each page. In that page, we hold:
   html, which is specific for each page, pagestyling css, page-specific images, the json for the content for the specific page and space-specific javascript.


3. Bootstrap
-------------
   This page is using bootstrap v5.0.2
   It is using that not by referencing to the online bootstrap repository, but by downloaded bootstrap files, residing in the common/bootstrap folder,
   to ensure consistency and performance.


4. Styling
------------
   There is a common styling (using css) that is used by every page. This stylesheet will be held in the common folder and is named sitestyle.css
   Of course, every page might hold specific styling and that can be commonly applied to all other pages.
   That specific styling for each page will be held in its folder and is named pagestyle.css


5. Images
-----------
   Images used by every page (such as the logo of Cabin Robin) will be held in the common folder.
   Images only used by specific pages will be held in their own folder.
   For images on each specific page, a corresponding json will exist for the metadata of the image and a local web-solution will be able to manage this metadata,
   because it's possible to change the images (by ftp) and thus it's metadata must be modified as well sometimes.


6. Navigation
--------------
   < Still to be decided by owner >


7. Translations
----------------
   A translation method is built in the website.
   For each page, but also for the website as a whole, there is a json which holds the content (text) of each element in two languages (dutch and english).
   This makes it easy to use javascript for giving the visitor the possibility to change between dutch and english.
   The content that is shared by all pages: footer and header for example, has a separate json in the common folder.


8. Reviews
-----------
   For pages that may hold reviews, a separate json will be available. This can be managed by a local-web-solution (like for the image) to manage this content.


9. Whatsapp-integration
------------------------
   An integration is used to give a whatsapp method when the visitor is longer then 2 minutes on a page.
   The whatsapp can be used on mobile and desktop to contact the owner of the website.
