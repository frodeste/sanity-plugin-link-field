import {describe, expect, it} from 'vitest'

import {generateHref} from './generateHref'

describe('generateHref', () => {
  it('generates communication link hrefs', () => {
    expect(generateHref.sms({type: 'sms', sms: '+1 555 123 4567'})).toBe('sms:+15551234567')
    expect(generateHref.whatsapp({type: 'whatsapp', whatsapp: '+47 98 76 54 32'})).toBe(
      'https://wa.me/4798765432',
    )
    expect(generateHref.fax({type: 'fax', fax: '555 0000'})).toBe('fax:5550000')
  })

  it('returns hash fallback for asset links without resolver', () => {
    expect(
      generateHref.document({
        type: 'document',
        documentLink: {_type: 'file', asset: {_ref: 'file-abc', _type: 'reference'}},
      }),
    ).toBe('#')

    expect(
      generateHref.media({
        type: 'media',
        mediaLink: {_type: 'file', asset: {_ref: 'file-xyz', _type: 'reference'}},
      }),
    ).toBe('#')
  })

  it('handles null UrlObject resolver results without throwing', () => {
    const nullResolver = () => null as unknown as string

    expect(
      generateHref.internal(
        {type: 'internal', internalLink: {_type: 'page', slug: {current: 'x'}}},
        nullResolver,
      ),
    ).toBe('/x')

    expect(
      generateHref.document(
        {
          type: 'document',
          documentLink: {_type: 'file', asset: {_ref: 'file-abc', _type: 'reference'}},
        },
        nullResolver,
      ),
    ).toBe('#')
  })

  it('merges parameters and anchors for external links', () => {
    expect(
      generateHref.external({
        type: 'external',
        url: 'https://example.com',
        parameters: '?utm_source=test',
        anchor: '#section',
      }),
    ).toBe('https://example.com?utm_source=test#section')
  })
})
