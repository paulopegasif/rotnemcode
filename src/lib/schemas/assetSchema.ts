import { z } from 'zod';

/**
 * Schema Zod para validação de Asset
 * - Validações: title (3-100), description (optional), type (enum), code (min 1), tags (max 10)
 * - Validação JSON customizada para templates
 */

export const assetSchema = z
  .object({
    title: z
      .string()
      .min(3, 'Título deve ter no mínimo 3 caracteres')
      .max(100, 'Título deve ter no máximo 100 caracteres')
      .describe('Título do asset'),

    description: z
      .string()
      .max(500, 'Descrição deve ter no máximo 500 caracteres')
      .optional()
      .describe('Descrição do asset'),

    type: z.enum(['template', 'section', 'css', 'js', 'html']).describe('Tipo do asset'),

    code: z.string().min(1, 'Código não pode estar vazio').describe('Código do asset'),

    tags: z
      .array(z.string().min(1).max(30))
      .max(10, 'Máximo 10 tags permitidas')
      .optional()
      .describe('Tags do asset'),
  })
  .refine(
    (data) => {
      // Validar JSON apenas se type = template
      if (data.type === 'template') {
        try {
          JSON.parse(data.code);
          return true;
        } catch {
          return false;
        }
      }
      // Para outros tipos, aceitar qualquer código
      return true;
    },
    {
      message: 'JSON inválido para template. Verifique a sintaxe.',
      path: ['code'],
    }
  );

// Type inference from schema
export type AssetFormData = z.infer<typeof assetSchema>;

/**
 * Validar dados de asset
 * @param data - Dados a validar
 * @returns Resultado da validação (sucesso ou erro)
 */
export function validateAsset(data: unknown) {
  return assetSchema.safeParse(data);
}

/**
 * Validar e lançar erro se inválido
 * @param data - Dados a validar
 * @returns Dados validados
 */
export function parseAsset(data: unknown) {
  return assetSchema.parse(data);
}
