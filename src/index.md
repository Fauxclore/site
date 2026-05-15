---
title: Jorge Graça (aka. fauxclore)
layout: "base.njk"
---

**faux.clo.re |** _"Folclore"_
nome masculino

1. Projeto artístico que procura explorar as intersecções entre o mundo da música eletrónica e escavações etnomusicológicas do folclore Português;
2. Epíteto do artista que desenvolve este projeto;
3. Músico, investigador, inventor de objetos sonoros;

<div class="post-mosaic">
  {% for post in collections.post %}
  <a class="general" href="{{post.url}}">
    <div class="post-container">
      <div class="post-info">
        <h3 class="post-title">{{ post.data.title }}</h3>
        <p class="post-slug">{{ post.data.slug }}</p>
      </div>
      <img
        src="{{ post.data.image }}"
        alt="{{ post.data.title }}"
        class="post-img"
      />
    </div>
  </a>
  {% endfor %}
</div>
