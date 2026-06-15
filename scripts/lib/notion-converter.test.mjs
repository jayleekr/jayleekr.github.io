import { describe, expect, it } from 'vitest';
import { NotionConverter, yamlArray, yamlString } from './notion-converter.mjs';

describe('notion frontmatter serialization', () => {
  it('serializes strings without breaking YAML quoting', () => {
    expect(yamlString('bad "quote": $(touch /tmp/yaml-owned)')).toBe(
      '"bad \\"quote\\": $(touch /tmp/yaml-owned)"'
    );
  });

  it('serializes arrays with escaped values', () => {
    expect(yamlArray(['AI', 'bad "tag"'])).toBe('["AI", "bad \\"tag\\""]');
  });

  it('falls back to untitled when slug would be empty', () => {
    const converter = Object.create(NotionConverter.prototype);

    expect(converter.generateSlug('!!!')).toBe('untitled');
  });
});
