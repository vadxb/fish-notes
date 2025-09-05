"use client";
import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import type { Marker } from "leaflet";

interface CustomMarkerProps {
  position: [number, number];
  isSelected?: boolean;
  markerIndex?: number;
  markerName?: string;
}

export default function CustomMarker({
  position,
  isSelected = false,
  markerIndex,
  markerName,
}: CustomMarkerProps) {
  const map = useMap();
  const markerRef = useRef<Marker | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Clean up existing marker first
    if (markerRef.current) {
      try {
        map.removeLayer(markerRef.current);
        markerRef.current = null;
      } catch (error) {
        console.warn("Failed to remove existing marker:", error);
      }
    }

    // Dynamically import Leaflet to avoid SSR issues
    const initMarker = async () => {
      // Check if map is ready and not in the middle of operations
      if (!map || !map.getContainer() || map._zooming || map._animatingZoom) {
        return;
      }

      const L = (await import("leaflet")).default;

      // Create custom icon with fishing logo
      const createCustomIcon = () => {
        const backgroundColor = isSelected ? "#059669" : "#2563eb"; // Green for selected, blue for normal
        const borderColor = isSelected ? "#10b981" : "white";
        const borderWidth = isSelected ? "4px" : "3px";

        const iconHtml = `
        <div style="
          width: 40px;
          height: 40px;
          background: ${backgroundColor};
          border: ${borderWidth} solid ${borderColor};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          position: relative;
        ">
          <svg width="20" height="20" viewBox="0 0 1024 1024" style="color: white;">
            <g transform="translate(0,1024) scale(0.1,-0.1)" fill="currentColor" stroke="none">
              <path d="M4795 9343 c-92 -8 -340 -47 -480 -74 -293 -58 -451 -105 -707 -210
-650 -266 -1146 -619 -1575 -1119 -454 -530 -835 -1311 -959 -1962 -43 -226
-55 -363 -60 -683 -6 -319 -1 -411 36 -745 21 -178 88 -464 159 -670 82 -242
254 -633 353 -805 13 -22 39 -67 57 -100 40 -70 198 -307 246 -371 222 -291
496 -568 755 -765 288 -219 427 -307 715 -453 375 -190 799 -325 1200 -383
308 -44 849 -43 1196 2 311 40 783 186 1116 345 778 371 1427 958 1830 1657
193 334 324 638 442 1028 73 242 118 497 142 795 13 169 12 606 -1 759 -51
569 -211 1086 -513 1655 -70 131 -285 458 -376 570 -401 497 -870 868 -1476
1169 -193 96 -537 215 -785 271 -333 76 -542 97 -959 94 -174 -1 -334 -3 -356
-5z m710 -348 c344 -33 572 -81 890 -189 266 -89 494 -200 774 -375 559 -351
1059 -929 1357 -1571 291 -624 411 -1218 375 -1848 -32 -555 -148 -1024 -381
-1532 -240 -524 -621 -1000 -1099 -1374 -486 -380 -1006 -618 -1586 -725 -503
-92 -955 -88 -1440 14 -197 41 -621 176 -770 245 -11 5 -49 22 -85 38 -157 69
-478 266 -675 415 -479 361 -914 929 -1176 1537 -210 487 -319 1024 -319 1570
0 636 125 1161 416 1742 337 673 845 1212 1481 1572 497 281 1076 449 1678
489 141 9 420 5 560 -8z"/>
              <path d="M5050 8691 c-479 -70 -887 -219 -1340 -489 -338 -202 -693 -506 -980
-838 -553 -642 -886 -1439 -907 -2164 -8 -295 18 -499 93 -730 77 -233 266
-508 447 -647 33 -26 58 -42 56 -37 -2 5 -55 85 -117 179 -113 168 -194 315
-227 410 -25 74 -81 308 -96 405 -21 130 -18 506 4 645 69 420 161 706 342
1065 181 361 465 740 802 1071 378 372 965 737 1438 894 387 129 904 216 1195
202 125 -6 117 1 -35 29 -140 25 -514 28 -675 5z"/>
              <path d="M6730 7514 c-221 -20 -500 -63 -680 -104 -168 -39 -369 -104 -695
-228 -40 -15 -42 -14 -195 40 -250 89 -443 126 -705 134 -164 6 -294 -4 -475
-36 -99 -17 -246 -70 -391 -141 l-142 -69 70 -73 c78 -80 98 -114 138 -232 52
-154 44 -401 -22 -636 -14 -52 -31 -119 -38 -149 -22 -94 -88 -230 -172 -355
-307 -459 -481 -851 -566 -1275 -39 -195 -50 -338 -44 -575 9 -326 42 -487
170 -820 59 -154 80 -218 148 -441 48 -162 204 -407 351 -554 82 -82 200 -180
218 -180 4 0 10 19 13 41 11 84 158 349 212 385 25 16 33 16 148 1 67 -9 159
-21 204 -27 46 -5 140 -23 210 -40 205 -50 213 -51 213 -26 0 41 -98 221 -164
303 -83 102 -221 232 -306 287 -36 23 -90 59 -120 78 -31 20 -128 73 -215 118
-203 104 -233 125 -273 184 -50 75 -66 143 -65 276 0 236 73 369 288 528 78
57 265 162 290 162 2 0 -10 -23 -28 -52 -29 -46 -32 -59 -32 -128 0 -70 4 -84
42 -161 31 -62 64 -109 125 -174 78 -84 171 -165 187 -165 4 0 14 19 21 43 15
51 102 268 204 509 41 97 80 203 87 235 7 32 13 59 14 60 1 2 44 14 96 27 354
90 718 239 933 383 28 18 51 31 53 30 1 -2 -10 -43 -24 -92 -23 -77 -26 -109
-27 -225 0 -131 16 -240 35 -240 10 0 146 127 213 199 63 67 173 228 210 306
19 38 53 138 76 220 24 83 48 155 54 162 6 6 45 25 86 41 188 75 636 294 795
390 304 184 485 343 673 592 162 215 238 385 273 613 22 143 -8 184 -128 175
-88 -7 -168 -36 -270 -98 -45 -28 -85 -50 -88 -50 -21 0 34 139 98 250 110
193 153 348 111 408 -62 89 -450 161 -899 167 -137 1 -270 1 -295 -1z m125
-443 c97 -56 126 -213 55 -295 -69 -78 -190 -96 -269 -41 -45 31 -91 111 -91
159 0 40 40 124 73 154 57 53 163 63 232 23z m695 -30 c0 -4 -18 -56 -40 -115
-53 -140 -89 -344 -96 -536 -4 -105 -2 -157 8 -189 l13 -43 45 37 c38 32 396
275 406 275 5 0 -42 -135 -57 -161 -47 -89 -172 -263 -250 -349 -114 -124
-206 -200 -349 -285 -242 -143 -450 -195 -665 -165 -287 39 -511 217 -650 515
-42 89 -69 204 -80 345 l-8 95 -18 -58 c-61 -195 -37 -444 69 -697 l40 -95
-186 -6 c-104 -4 -226 -14 -275 -23 -100 -19 -260 -74 -388 -133 -86 -40 -239
-137 -239 -151 0 -11 183 -115 257 -146 74 -31 210 -56 304 -56 74 0 188 21
246 45 20 8 38 14 39 12 6 -6 -127 -121 -207 -178 -175 -127 -539 -297 -946
-444 -208 -75 -554 -246 -723 -356 -104 -68 -227 -181 -284 -263 -81 -114
-206 -396 -206 -465 0 -80 -44 80 -71 259 -23 147 3 478 52 667 53 208 296
661 497 928 133 175 404 453 589 602 121 99 365 275 495 360 350 227 1011 533
1151 533 l29 0 -8 -67 c-15 -112 -9 -250 15 -343 47 -192 190 -408 311 -472
51 -27 61 -29 145 -26 83 3 96 6 149 38 151 91 321 301 421 520 81 179 262
440 375 543 59 53 90 70 90 48z"/>
              <path d="M7738 5250 c-108 -18 -249 -127 -296 -228 -36 -78 -47 -192 -28 -276
18 -75 52 -148 92 -196 22 -26 25 -36 17 -49 -30 -48 -252 -488 -326 -646 -47
-99 -132 -278 -191 -399 -58 -120 -106 -221 -106 -223 0 -12 -279 -559 -318
-623 -172 -284 -352 -410 -586 -410 -181 1 -284 39 -386 146 -130 135 -179
336 -130 529 19 76 86 216 105 221 6 2 27 -31 47 -74 31 -64 130 -199 148
-201 3 -1 4 36 2 81 -4 98 17 235 89 569 45 212 76 340 107 437 6 17 7 32 3
32 -13 0 -239 -241 -519 -553 -171 -190 -278 -408 -302 -613 -29 -239 59 -473
245 -659 104 -104 191 -157 335 -206 88 -31 105 -33 225 -33 183 0 260 20 430
113 199 108 331 246 456 476 68 124 250 494 589 1190 48 99 151 309 228 467
l141 286 39 -5 c121 -16 293 93 365 232 31 58 32 64 32 185 0 154 -20 215 -99
298 -106 113 -248 159 -408 132z m187 -289 c93 -52 88 -217 -9 -265 -49 -24
-134 -24 -175 0 -60 35 -78 130 -42 211 21 45 46 63 101 73 44 9 87 2 125 -19z"/>
            </g>
          </svg>
          ${
            isSelected && markerIndex !== undefined
              ? `
            <div style="
              position: absolute;
              top: -8px;
              right: -8px;
              width: 20px;
              height: 20px;
              background: #f59e0b;
              border: 2px solid white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 10px;
              font-weight: bold;
              color: white;
            ">
              ${markerIndex + 2}
            </div>
          `
              : ""
          }
        </div>
      `;

        return L.divIcon({
          html: iconHtml,
          className: "custom-fishing-marker",
          iconSize: [40, 40],
          iconAnchor: [20, 20],
          popupAnchor: [0, -20],
        });
      };

      try {
        // Don't create marker if one already exists
        if (markerRef.current) {
          return;
        }

        // Create and add marker
        const customIcon = createCustomIcon();
        const marker = L.marker(position, { icon: customIcon }).addTo(map);

        // Add popup with marker name if provided
        if (markerName) {
          marker.bindPopup(markerName);
        }

        markerRef.current = marker;

        return () => {
          if (markerRef.current) {
            try {
              map.removeLayer(markerRef.current);
            } catch (error) {
              console.warn("Failed to remove marker:", error);
            }
          }
        };
      } catch (error) {
        console.warn("Failed to create marker:", error);
        return () => {}; // Return empty cleanup function
      }
    };

    // Add a longer delay to wait for zoom animations to complete
    const timeoutId = setTimeout(() => {
      initMarker();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [map, position[0], position[1], isSelected, markerIndex, markerName]);

  return null;
}
