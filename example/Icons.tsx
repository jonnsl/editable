
import React from 'react'

export function Grip (props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
  return (
    <div {...props} className="no-ouline">
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" focusable="false" viewBox="0 0 12 12">
        <g fill="currentColor">
          <rect width="2" height="2" x="3" y="1" rx=".5" ry=".5"/>
          <rect width="2" height="2" x="7" y="1" rx=".5" ry=".5"/>
          <rect width="2" height="2" x="3" y="5" rx=".5" ry=".5"/>
          <rect width="2" height="2" x="7" y="5" rx=".5" ry=".5"/>
          <rect width="2" height="2" x="3" y="9" rx=".5" ry=".5"/>
          <rect width="2" height="2" x="7" y="9" rx=".5" ry=".5"/>
        </g>
      </svg>
    </div>
  )
}
