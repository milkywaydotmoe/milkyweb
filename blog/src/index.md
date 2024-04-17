---
layout: base.njk
permalink: index.html
title: MiLKY-Blog!
description: A blog written by a disaster of a person!
featured_image: favicon.png
---
Thanks for visiting my blog! I write about stuff i like. Is it gonna be videogames or obscure amiga trackers, you'll never know :3

--- 
<!-- This next part will show your top three most recent posts. You can change how readableDate looks in your .eleventy.js file-->
## Recent Blog Posts

<div id="recentpostlistdiv">
  <ul>
  {% assign top_posts = collections.posts | reverse %}
	{%- for post in top_posts limit:3 -%}
		<li><a href="{{ post.data.permalink }}">{{ post.data.date | readableDate }} » {{ post.data.title }}</a></li>
	{% endfor %}<li class="moreposts"><a href="archives.html">» Archives</a></li><li class="moreposts"><a href="rss.xml">» RSS feed</a></li></ul>
</div>