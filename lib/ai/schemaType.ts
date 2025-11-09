// Runtime & compile-time shim for JSON Schema 'Type' used around the app.
// This avoids importing a 'Type' helper from the GenAI package and keeps
// schema definitions stable during development.
const Type = {
  OBJECT: 'object',
  ARRAY: 'array',
  STRING: 'string',
  BOOLEAN: 'boolean',
  NUMBER: 'number',
} as const;

export { Type };
