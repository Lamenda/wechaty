#!/usr/bin/env ts-node
/**
 *   Wechaty - https://github.com/chatie/wechaty
 *
 *   @copyright 2016-2018 Huan LI <zixia@zixia.net>
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */
// tslint:disable:no-shadowed-variable
import test  from 'blue-tape'

import {
  digestEmoji,
  plainText,
  stripEmoji,
  stripHtml,
  unescapeHtml,
  unifyEmoji,
}                   from './xml'

test('stripHtml()', async t => {
  const HTML_BEFORE_STRIP = 'Outer<html>Inner</html>'
  const HTML_AFTER_STRIP  = 'OuterInner'

  const strippedHtml = stripHtml(HTML_BEFORE_STRIP)
  t.is(strippedHtml, HTML_AFTER_STRIP, 'should strip html as expected')
})

test('unescapeHtml()', async t => {
  const HTML_BEFORE_UNESCAPE  = '&apos;|&quot;|&gt;|&lt;|&amp;'
  const HTML_AFTER_UNESCAPE   = `'|"|>|<|&`

  const unescapedHtml = unescapeHtml(HTML_BEFORE_UNESCAPE)
  t.is(unescapedHtml, HTML_AFTER_UNESCAPE, 'should unescape html as expected')
})

test('plainText()', async t => {
  const PLAIN_BEFORE  = '&amp;<html>&amp;</html>&amp;<img class="emoji emoji1f4a4" text="[流汗]_web" src="/zh_CN/htmledition/v2/images/spacer.gif" />'
  const PLAIN_AFTER   = '&&&[流汗]'

  const text = plainText(PLAIN_BEFORE)
  t.is(text, PLAIN_AFTER, 'should convert plain text as expected')

})

test('digestEmoji()', async t => {
  const EMOJI_XML = [
    '<img class="emoji emoji1f4a4" text="[流汗]_web" src="/zh_CN/htmledition/v2/images/spacer.gif" />',
    '<img class="qqemoji qqemoji13" text="[呲牙]_web" src="/zh_CN/htmledition/v2/images/spacer.gif" />',
    '<img class="emoji emoji1f44d" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif" />',
    '<span class="emoji emoji1f334"></span>',
  ]
  const EMOJI_AFTER_DIGEST  = [
    '[流汗]',
    '[呲牙]',
    '',
    '[emoji1f334]',
  ]

  for (let i = 0; i < EMOJI_XML.length; i++) {
    const emojiDigest = digestEmoji(EMOJI_XML[i])
    t.is(emojiDigest, EMOJI_AFTER_DIGEST[i], 'should digest emoji string ' + i + ' as expected')
  }
})

test('unifyEmoji()', async t => {
  const ORIGNAL_XML_LIST: Array<[string[], string]> = [
    [
      [
        '<img class="emoji emoji1f602" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif" />',
        '<span class=\"emoji emoji1f602\"></span>',
      ],
        '<emoji code="emoji1f602"/>',
    ],
  ]

  ORIGNAL_XML_LIST.forEach(([xmlList, expectedEmojiXml]) => {
    xmlList.forEach(xml => {
      const unifiedXml = unifyEmoji(xml)
      t.is(unifiedXml, expectedEmojiXml, 'should convert the emoji xml to the expected unified xml')
    })
  })
})

test('stripEmoji()', async t => {
  const EMOJI_STR = [
    [
      'ABC<img class="emoji emoji1f4a4" text="[流汗]_web" src="/zh_CN/htmledition/v2/images/spacer.gif" />DEF',
      'ABCDEF',
    ],
    [
      'UVW<span class="emoji emoji1f334"></span>XYZ',
      'UVWXYZ',
    ],
  ]

  EMOJI_STR.forEach(([emojiStr, expectResult]) => {
    const result = stripEmoji(emojiStr)
    t.is(result, expectResult, 'should strip to the expected str')
  })

  const empty = stripEmoji(undefined)
  t.is(empty, '', 'should return empty string for `undefined`')
})
