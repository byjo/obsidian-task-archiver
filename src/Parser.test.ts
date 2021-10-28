import { Parser } from "./Parser";

test("Builds a flat structure with non-hierarchical text", () => {
    const lines = ["text", "|table|", "|----|", "|row|", "|another row|", ""];

    const doc = new Parser().parse(lines);

    for (let i = 0; i < lines.length; i++) {
        expect(doc.children[i].textContent).toEqual(lines[i]);
    }
});

describe("Headings", () => {
    test("Text after a heading gets nested", () => {
        const lines = ["# H1", "line"];

        const doc = new Parser().parse(lines);

        expect(doc.children.length).toBe(1);
        expect(doc.children[0].children.length).toBe(1);
        expect(doc.children[0].children[0].textContent).toBe("line");
    });

    test("A subheading creates another level of nesting", () => {
        const lines = ["# H1", "## H2", "line"];

        const doc = new Parser().parse(lines);

        const h1 = doc.children[0];
        expect(h1.children.length).toBe(1);
        const h2 = h1.children[0];
        expect(h2.children[0].textContent).toBe("line");
    });

    test("A same-level heading doesn't get nested", () => {
        const lines = ["# H1", "## H2", "## H2-2"];

        const doc = new Parser().parse(lines);

        const h1 = doc.children[0];
        expect(h1.children.length).toBe(2);
    });

    test("A higher-level heading pops nesting", () => {
        const lines = ["# H1", "## H2", "# H1", "line"];

        const doc = new Parser().parse(lines);

        expect(doc.children.length).toBe(2);
        const secondH1 = doc.children[1];
        expect(secondH1.children.length).toBe(1);
    });
});

describe("List items", () => {
    test("Top level text after a list item doesn't get nested", () => {
        const lines = ["- l", "text"];

        const doc = new Parser().parse(lines);
        expect(doc.children.length).toBe(2);
    })

    test("Indented text after a list item gets nested", () => {
        const lines = ["- l", "  text"];

        const doc = new Parser().parse(lines);
        expect(doc.children.length).toBe(1);
        const listItem = doc.children[0];
        expect(listItem.children.length).toBe(1);
    });

    test("An indented list item creates another level of nesting", () => {
        const lines = ["- l", "  - l2", "    text"];

        const doc = new Parser().parse(lines);
        const listItem = doc.children[0];
        const indentedListItem = listItem.children[0]
        expect(indentedListItem.children.length).toBe(1);
    })

    test("A same level list item doesn't get nested", () => {
        const lines = ["- l", "  - l2", "  - l2-2"];
        const doc = new Parser().parse(lines);
        const listItem = doc.children[0];
        expect(listItem.children.length).toBe(2)
    });

    test("A higher-level list item pops nesting", () => {
        const lines = ["- l", "  - l2", "- l2-2"];
        const doc = new Parser().parse(lines);
        expect(doc.children.length).toBe(2)
    })

    test("A top-level line breaks out of a list context", () => {
        const lines = ["- l", "  - l2", "line"];
        const doc = new Parser().parse(lines);
        expect(doc.children.length).toBe(2)
    })
});
