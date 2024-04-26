---
layout: post.njk
permalink: posts/2024-04-17-Hello-World.html
title: Optimizing my site
date: 2024-04-26
description: Detailing how i got my site to load faster.
featured_image: https://file.garden/ZgvLyuxekygVJeux/blog/emuwhitehouse.webp
tags:
  - optimizing
  - webdev
---
Well, its that time of the year. When i finally realize my site is an absolute ***DUMPSTER FIRE*** and i need to optimize it because frankly, my site loads slow, **EVEN LOCALLY**.

I'm currently writing this blog post as i go so watch me girlboss my way into somehow finding a fix powered by prayers and hope.

Firstly, tackling why the layout takes so long to load...


    <script src="marquee.js" async></script>
    <script src="unix.js" defer></script>
    <script src="darkmode.js"></script>
    <script src="plushpop.js" async></script>
    <script src="buttons.js"></script>

    <!--[if IE]>
    <script src="/oneko/oneko-ie6.js"></script>
    <![endif]-->
    <!--[if !IE]><!-->
    <script data-cat="/oneko/trans.png" src="/oneko/oneko.js"></script>
    <!--<![endif]-->

    <script>
    document.getElementById("disabled").addEventListener("click", function(event) {
        event.preventDefault(); // Prevent the default link behavior
    });
    </script>
    
Yep. Maybe that's the problem. I'll try that first....

I examine it's the same. Well, maybe i should try having the JS load as soon as the site is done loading.

![Script tags.](https://i.stack.imgur.com/FcAKu.png)

I then came across this image. Most of my tags load with async or defer. 

I try using the type=module and BOOM. It loads with a decent pace... well, locally, We'll see how the network fares.

Next to tackle is the font loading.

I'll convert them into WOFF files, and after that.... well, font loading got slightly faster. No more initializing.
![fonts converted to woff](https://file.garden/ZgvLyuxekygVJeux/blog/fonts.png)

Now for the images. It can't be that bad right?
![GOD HAVE MERCY](https://file.garden/ZgvLyuxekygVJeux/blog/ohgod.png)
It's that bad. Oh jeez.

Well, i did research on what image formats were the fastest loading... and...
![copium](https://file.garden/ZgvLyuxekygVJeux/blog/webp.png)
NOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
WHY DID IT HAVE TO BE WEBP

Well... lets just disregard that.
Blog post finished. I refuse to use WEBP.
Well maybe i'll do it on a few items (the worst offenders)