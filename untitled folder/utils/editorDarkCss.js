// utils/editorDarkCss
// only applies during dark mode
export default `
.rc-md-editor, .rc-md-navigation, .editor-container, .custom-html-style
{
background: #2b3035 !important;
color: white !important;
}
.rc-md-editor table th, .rc-md-editor table tr {
background-color: #2b3035 !important;
color: white;
}
.custom-html-style table td {
background-color: #2b3035;
}
.rc-md-editor a {
color: yellow;
}
.section.sec-md.visible, .section.sec-md.visible textarea {
background-color: #2b3035 !important;
color: white !important;
}
.button-wrap span:hover {
color: lightgray !important;
}
pre.hljs {
background-color: #2b3035 !important;
color: white;
border: 1px solid gray;
}
pre.hljs code {
background-color: transparent;
}
`
;