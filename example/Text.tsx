
import React, { ReactNode } from 'react'

type TextProps = {
  children: string;
}

export default function Text (props: TextProps) {
  const paragraphs = props.children.split(/\r?\n(?:\r?\n)+/).map((paragraph) => paragraph.trim())

  return paragraphs.map(function (paragraph: string, idx: number) {
    const lines = paragraph.split(/\r?\n/)
    return <p key={idx}>{ lines.reduce(addLineBreak, []) }</p>
  })
}

/**
 * Reducer that adds a line break between each item of an array.
 */
function addLineBreak (children: ReactNode[], line: string, idx: number, lines: string[]) {
  const isLastItem = lines.length === idx + 1
  return isLastItem
    ? children.concat([line])
    : children.concat([line, <br key={idx}/>])
}
