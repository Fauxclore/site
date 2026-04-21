---
title: Jorge Graça (aka. fauxclore)
layout: "base_en.njk"
---

**faux.clo.re |** _"Folclore"_
male name

1. Artistic project that seeks to explore the intersections between the world of electronic music and ethnomusicological excavations of Portuguese folklore;
2. Epithet of the artist developing this project;
3. Musician, researcher, inventor of sound objects;

<div class="post-mosaic">
  {% for post_en in collections.post_en %}
  <a  href="{{post_en.url}}">
    <div class="post-container">
      <div class="post-info">
        <h3 class="post-title">{{ post_en.data.title }}</h3>
        <p class="post-slug">{{ post_en.data.slug }}</p>
      </div>
      <img
        src="{{ post_en.data.image }}"
        alt="{{ post_en.data.title }}"
        class="post-img"
      />
    </div>
  </a>
  {% endfor %}
</div>
