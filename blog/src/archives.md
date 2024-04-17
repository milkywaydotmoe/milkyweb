---
layout: base.njk
permalink: archives.html
title: Archives
description: These are where old posts go!
featured_image: favicon.png
---
You can also follow this site on [RSS](rss.xml)!

---

<!--This next part shows all of your posts tagged "posts" in reverse chronological order-->
<ul class="none">
{% assign top_posts = collections.posts | reverse %}
{%- for post in top_posts -%}
  <li><a href="{{ post.data.permalink }}">{{ post.data.date | readableDate }} » {{ post.data.title }}</a></li>
{% endfor %}
</ul>