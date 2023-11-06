/**
   * instruct_text expected format:
   * [
   *  '_Q: This is a question',
   *  '_A: This is an answer',
   *  '_Q: This is another question'
   * ]
   */
function getSectionsChildren(text_arr) {
    let children = [];
    for (text_str of text_arr) {
        let text_extract = text_str.slice(4); // '_Q: ' removed
        switch (text_str[1]) {
            case 'Q':
                children.push(new docx.Paragraph({
                    text: "",
                    spacing: { before: docx.convertMillimetersToTwip(4) },
                    numbering: {
                        reference: "numbered-parts-list",
                        level: 0,
                    },
                }),
                    new docx.Paragraph({
                        text: text_extract,
                        spacing: { before: docx.convertMillimetersToTwip(6) },
                        numbering: {
                            reference: "numbered-list",
                            level: 0,
                        },
                    }));
                break;
            case 'A':
                children.push(new docx.Paragraph({
                    text: text_extract,
                    spacing: { before: docx.convertMillimetersToTwip(6) },
                    numbering: {
                        reference: "numbered-list",
                        level: 1,
                    },
                }));
                break;
            case 'P':
                children.push(new docx.Paragraph({
                    text: text_extract,
                    spacing: { before: docx.convertMillimetersToTwip(2) },
                    numbering: {
                        reference: "numbered-parts-list",
                        level: 1,
                    },
                }));
                break;
            default:
                console.log('Error: none of Q, A, P')
        }
    }
    return children
}

/**
 * boiler plate code for docx + numbering style
 */
function generateDocx(sectionsChildren) {

    const doc = new docx.Document({
        styles: {
            default: {
                document: {
                    run: {
                        size: "11.5pt"
                    }
                }
            }
        },
        numbering: {
            config: [
                {
                    reference: "numbered-list",
                    levels: [
                        {
                            level: 0,
                            format: docx.LevelFormat.DECIMAL,
                            text: "%1.",
                            alignment: docx.AlignmentType.LEFT,
                            style: {
                                paragraph: {
                                    indent: { left: docx.convertMillimetersToTwip(6.4), hanging: docx.convertMillimetersToTwip(6.4) },
                                },
                                // run: {
                                //   size: "10pt"
                                // },
                            },
                        },
                        {
                            level: 1,
                            format: docx.LevelFormat.UPPER_LETTER,
                            text: "%2.",
                            alignment: docx.AlignmentType.LEFT,
                            style: {
                                paragraph: {
                                    indent: { left: docx.convertMillimetersToTwip(15), hanging: docx.convertMillimetersToTwip(7.5) },
                                },
                            },
                        },
                    ],
                },
                {
                    reference: "numbered-parts-list",
                    levels: [
                        {
                            level: 0,
                            alignment: docx.AlignmentType.RIGHT,
                            style: {
                                paragraph: {
                                    indent: { left: docx.convertMillimetersToTwip(6.4), hanging: docx.convertMillimetersToTwip(6.4) },
                                },
                            },
                        },
                        {
                            level: 1,
                            format: docx.LevelFormat.LOWER_ROMAN,
                            text: "%2.",
                            alignment: docx.AlignmentType.RIGHT,
                            style: {
                                paragraph: {
                                    indent: { left: docx.convertMillimetersToTwip(15), hanging: docx.convertMillimetersToTwip(5) },
                                },
                            },
                        },
                    ],
                }
            ],
        },
        sections: [{
            children: sectionsChildren,
        }]
    });

    docx.Packer.toBlob(doc).then((blob) => {
        console.log(blob);
        saveAs(blob, "MCQs-Exam-Paper-STUDENT.docx");
        console.log("Document created successfully");
    });
}