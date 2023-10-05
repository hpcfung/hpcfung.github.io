
constructor: `[]` array, `{}` object

```
style: {
  paragraph: {
    indent: { left: 363, hanging: 363 },
  },
}
```
number in twips

for some reasons, `spacing` cannot be placed insider `style`, `paragraph` along with `indent` (even though this is what they do here https://docx.js.org/#/usage/styling-with-js?id=declaritive-styles-similar-to-external-css)

instead, must be placed inside each `docx.Paragraph`
