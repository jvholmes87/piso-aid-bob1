from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import math
p=Path(__file__).parent
font='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
def f(n): return ImageFont.truetype(font,n)
def frame(t):
 im=Image.new('RGB',(1000,700),'#f5f8fc');d=ImageDraw.Draw(im)
 d.text((42,25),'BOB 1 | Component assembly concept',font=f(29),fill='#132d4e')
 d.text((42,69),'Simplified side-by-side component groups',font=f(17),fill='#52677e')
 # Four drums shown individually for clarity, not in their physical plan arrangement.
 for x in [90,210,330,450]:
  d.rounded_rectangle((x,515,x+100,590),radius=26,fill='#1979b6',outline='#174568',width=3)
  d.line((x+25,520,x+25,585),fill='#bfcbd5',width=7)
  d.line((x+75,520,x+75,585),fill='#bfcbd5',width=7)
 for y,label,color,assembled in [(405,'Frame and retaining supports','#778b9b',493),(300,'Deck','#bf9562',477),(167,'Sensors, power and controls','#27496b',393)]:
  yy=round(y*(1-t)+assembled*t)
  if y==167:
   for x,h,w in [(110,44,70),(230,65,95),(370,45,90),(510,90,18)]:
    d.rounded_rectangle((x,yy-h,x+w,yy),radius=5,fill=color)
  else:
   d.rounded_rectangle((80,yy,570,yy+16),radius=3,fill=color)
  d.line((590,yy+8,640,y+8),fill='#7a8ea4',width=2)
  d.text((655,y-4),label,font=f(16),fill='#163450')
 d.text((655,543),'Four flotation drums',font=f(16),fill='#163450')
 d.text((42,625),'ILLUSTRATIVE ONLY | Not to scale | No fit or motion validation',font=f(16),fill='#52677e')
 d.text((42,655),'Flotation arrangement simplified; propulsion omitted for clarity.',font=f(15),fill='#52677e')
 return im
frame(0).save(p/'bob1-component-concept.png')
palette=frame(0).resize((700,490)).quantize(colors=32)
frames=[]
for n in range(30):
 t=(1-math.cos(2*math.pi*n/29))/2
 frames.append(frame(t).resize((700,490)).quantize(palette=palette))
frames[0].save(p/'bob1-assembly-concept.gif',save_all=True,append_images=frames[1:],duration=200,loop=0,optimize=True)
print('Created component illustration and 6-second looping schematic animation')
