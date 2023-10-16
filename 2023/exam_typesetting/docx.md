
constructor: `[]` array, `{}` object

```
style: {
  paragraph: {
    indent: { left: 363, hanging: 363 },
  },
}
```
number in twips\
use `docx.convertMillimetersToTwip()` for readability/ease of refactoring

for some reasons, `spacing` cannot be placed insider `style`, `paragraph` along with `indent` (even though this is what they do here https://docx.js.org/#/usage/styling-with-js?id=declaritive-styles-similar-to-external-css)

instead, must be placed inside each `docx.Paragraph`


Strategy to create different font size for list labels and list text:\
`run`, `size` in `default`, `document` controls default font size\
is overwritten in `numbering`
