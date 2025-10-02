{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\froman\fcharset0 Times-Roman;}
{\colortbl;\red255\green255\blue255;\red0\green0\blue0;}
{\*\expandedcolortbl;;\cssrgb\c0\c0\c0;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\sa240\partightenfactor0

\f0\fs24 \cf0 \expnd0\expndtw0\kerning0
# StreamForge API\
\
## Endpoints\
- POST /api/auth/register \{email, password\} -> \{token\}\
- POST /api/streams/boost \{artistId, songTitle, platforms: []\} -> [\{success, platform\}]\
- GET /api/analytics/summary/:artistId -> \{summary: \{spotify: 1000\}, totalStreams\}\
- POST /api/analytics/estimate \{artistId, songTitle\} -> \{totalRevenue: "$42.00", advice\}\
\
Auth: Bearer token. All secure.}