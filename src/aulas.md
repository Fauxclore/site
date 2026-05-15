---
title: Aulas
layout: "base.njk"
---

Nesta página estão reunidos materiais que vou criando para usar em aulas, em particular nas sessões em videochamada, onde privilegioo trabalho autónomo em grupos e procuro "desestabilizar" as expectativas sobre o decorrer de uma aula. São manuais de instruções para seguir de forma independente, que conduzem (quase sempre) a resultados personalizados e ricos para discutir em conjunto.

<div class="post-mosaic">
  {% for aula in collections.aula %}
  <a class="general" href="{{aula.url}}">
    <div class="post-container">
      <div class="post-info">
        <h3 class="post-title">{{ aula.data.title }}</h3>
        <p class="post-slug">{{ aula.data.slug }}</p>
      </div>
      <img
        src="{{ aula.data.image }}"
        alt="{{ aula.data.title }}"
        class="post-img"
      />
    </div>
  </a>
  {% endfor %}
</div>
