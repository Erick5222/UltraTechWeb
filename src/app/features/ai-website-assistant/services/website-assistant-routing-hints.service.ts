import { Injectable } from '@angular/core';

import {
  WEBSITE_ASSISTANT_CONTACT_HINT,
  WEBSITE_ASSISTANT_SERVICES_HINT,
  WebsiteAssistantRoutingIntent,
} from '../website-assistant.model';

const CONTACT_KEYWORDS = [
  'humano',
  'human',
  'persona',
  'person',
  'contacto',
  'contact',
  'hablar con',
  'speak with',
  'talk to',
  'representante',
  'representative',
  'agente',
  'agent',
  'reunion',
  'reunión',
  'meeting',
  'llamar',
  'call',
  'correo',
  'email',
  'equipo',
  'team',
  'ventas',
  'sales',
  'soporte',
  'support',
  'whatsapp',
  'telefono',
  'teléfono',
  'phone',
];

const SERVICES_KEYWORDS = [
  'proceso',
  'process',
  'servicio',
  'services',
  'como funciona',
  'cómo funciona',
  'how does it work',
  'how it works',
  'workflow',
  'flujo',
  'metodologia',
  'metodología',
  'methodology',
  'que ofrecen',
  'qué ofrecen',
  'what do you offer',
  'solucion',
  'solución',
  'solution',
  'implementacion',
  'implementación',
  'implementation',
  'desarrollo',
  'development',
  'automatizacion',
  'automatización',
  'automation',
];

@Injectable()
export class WebsiteAssistantRoutingHintsService {
  detectIntent(prompt: string): WebsiteAssistantRoutingIntent {
    const normalized = this.normalize(prompt);

    if (this.matchesAny(normalized, CONTACT_KEYWORDS)) {
      return 'contact';
    }

    if (this.matchesAny(normalized, SERVICES_KEYWORDS)) {
      return 'services';
    }

    return 'general';
  }

  getHint(intent: WebsiteAssistantRoutingIntent): string | null {
    if (intent === 'contact') {
      return WEBSITE_ASSISTANT_CONTACT_HINT;
    }

    if (intent === 'services') {
      return WEBSITE_ASSISTANT_SERVICES_HINT;
    }

    return null;
  }

  private normalize(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  private matchesAny(normalized: string, keywords: string[]): boolean {
    return keywords.some((keyword) => normalized.includes(this.normalize(keyword)));
  }
}
