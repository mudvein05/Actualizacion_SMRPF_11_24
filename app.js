/**
 * APP.JS - LÓGICA INTERACTIVA DEL GEOPORTAL DE TESIS
 * SMRPF Guatemala 2011–2025
 */

document.addEventListener("DOMContentLoaded", () => {
    // ── ESTADO GLOBAL DE LA APLICACIÓN ──
    const REGION_KEYS = ["general", "r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9", "r10"];
    let currentRegionIndex = 0;
    let probosqueChartInstance = null;
    let compAreaChartInstance = null;
    let compCarbonoChartInstance = null;
    let compFinEmpleosChartInstance = null;
    let map = null;
    let geojsonLayer = null;
    let restorationLayer = null;
    let hillshadeLayer = null;
    let currentBasemap = "sat";

    // ── ELEMENTOS DEL DOM ──
    const sidebarNav = document.getElementById("sidebarNav");
    const sidebar = document.getElementById("sidebar");
    const sidebarToggle = document.getElementById("sidebarToggle");
    const currentRegionPillText = document.getElementById("currentRegionPillText");
    const heroTitle = document.getElementById("heroTitle");
    const heroDeptos = document.getElementById("heroDeptos");
    const heroBadge = document.getElementById("heroBadge");
    const highlightsList = document.getElementById("highlightsList");

    const kpiArea = document.getElementById("kpiArea");
    const kpiCarbono = document.getElementById("kpiCarbono");
    const kpiAP = document.getElementById("kpiAP");
    const kpiEmpleos = document.getElementById("kpiEmpleos");
    const kpiFin = document.getElementById("kpiFin");
    const kpiPoligonos = document.getElementById("kpiPoligonos");

    const btnPrevSlide = document.getElementById("btnPrevSlide");
    const btnNextSlide = document.getElementById("btnNextSlide");
    const slideCounterText = document.getElementById("slideCounterText");

    const slideModal = document.getElementById("slideModal");
    const modalSlideImg = document.getElementById("modalSlideImg");
    const modalSlideTitle = document.getElementById("modalSlideTitle");
    const modalCloseBtn = document.getElementById("modalCloseBtn");
    const btnSlideView = document.getElementById("btnSlideView");
    const btnPreviewSlideInline = document.getElementById("btnPreviewSlideInline");

    const btnFullscreen = document.getElementById("btnFullscreen");
    const btnToggleBottomFs = document.getElementById("btnToggleBottomFs");
    const btnRecenterMap = document.getElementById("btnRecenterMap");
    const btnDownloadCSV = document.getElementById("btnDownloadCSV");
    const tableFilterInput = document.getElementById("tableFilterInput");
    const tableBody = document.getElementById("tableBody");

    // ── 1. CONSTRUCCIÓN DEL MENÚ LATERAL (ESTILO GRETTEL VARGAS) ──
    function buildSidebar() {
        sidebarNav.innerHTML = "";

        // Grupo Nacional
        const groupNational = document.createElement("div");
        groupNational.className = "nav-group-label";
        groupNational.innerHTML = `<i class="fa-solid fa-earth-americas"></i> <span>Nivel Nacional</span>`;
        sidebarNav.appendChild(groupNational);

        const genData = REGIONS_DATA["general"];
        const genBtn = createNavItem("general", 0, "0", genData.name, "Total República de Guatemala");
        sidebarNav.appendChild(genBtn);

        // Grupo Regiones
        const groupRegions = document.createElement("div");
        groupRegions.className = "nav-group-label";
        groupRegions.style.marginTop = "12px";
        groupRegions.innerHTML = `<i class="fa-solid fa-map-location-dot"></i> <span>Regiones Administrativas INAB</span>`;
        sidebarNav.appendChild(groupRegions);

        REGION_KEYS.slice(1).forEach((key, idx) => {
            const data = REGIONS_DATA[key];
            const itemBtn = createNavItem(key, idx + 1, data.roman, data.name, data.deptos);
            sidebarNav.appendChild(itemBtn);
        });
    }

    function createNavItem(key, index, badgeText, title, subText) {
        const btn = document.createElement("button");
        btn.className = `nav-item ${index === currentRegionIndex ? "active" : ""}`;
        btn.dataset.key = key;
        btn.dataset.index = index;

        btn.innerHTML = `
            <div class="nav-badge">${badgeText}</div>
            <div class="nav-info">
                <span class="nav-name">${title}</span>
                <span class="nav-meta">${subText}</span>
            </div>
        `;

        btn.addEventListener("click", () => {
            selectRegionByIndex(index);
            // En móviles, cerrar sidebar
            if (window.innerWidth <= 1024) {
                sidebar.classList.remove("open-mobile");
            }
        });

        return btn;
    }

    // ── 2. ANIMACIÓN DE NÚMEROS KPI (COUNT-UP) ──
    function animateValue(element, start, end, duration, isCurrency = false, decimals = 2) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = start + (end - start) * ease;
            
            let formatted = current.toLocaleString("en-US", {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            });

            if (isCurrency) {
                element.textContent = "$" + formatted;
            } else {
                element.textContent = formatted;
            }

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // ── 3. ACTUALIZACIÓN DEL DASHBOARD ──
    function updateDashboard(regKey) {
        const data = REGIONS_DATA[regKey];
        if (!data) return;

        // Actualizar Textos
        heroTitle.textContent = data.name;
        heroDeptos.textContent = data.deptos;
        heroBadge.textContent = data.id === "general" ? "Nivel Nacional · 2011–2025" : `Región ${data.roman} · SMRPF`;
        currentRegionPillText.textContent = data.name;

        // Animar KPIs
        animateValue(kpiArea, 0, data.area_ha, 700, false, 2);
        animateValue(kpiCarbono, 0, data.carbono_tco2, 700, false, 2);
        animateValue(kpiAP, 0, data.ha_ap, 700, false, 2);
        animateValue(kpiEmpleos, 0, data.empleos, 700, false, 0);
        animateValue(kpiFin, 0, data.financiamiento_usd, 700, true, 2);
        animateValue(kpiPoligonos, 0, data.poligonos, 700, false, 0);

        // Aspectos Relevantes / Tesis Highlights
        highlightsList.innerHTML = "";
        data.highlights.forEach(h => {
            const li = document.createElement("li");
            li.textContent = h;
            highlightsList.appendChild(li);
        });

        // Actualizar Gráfica Circular de PROBOSQUE
        updateProbosqueChart(data.modalidades);

        // Actualizar Controles de Presentación
        const slideNumber = currentRegionIndex + 1;
        slideCounterText.textContent = `${slideNumber} / 11 · ${data.name}`;
        btnPrevSlide.disabled = currentRegionIndex === 0;
        btnNextSlide.disabled = currentRegionIndex === REGION_KEYS.length - 1;

        // Actualizar imagen de la lámina original de Canva en el modal
        modalSlideImg.src = `assets/slides/page_${slideNumber}.png`;
        modalSlideTitle.textContent = `Lámina Canva Oficial (${slideNumber}/11) — ${data.name}`;

        // Resaltar en Sidebar
        document.querySelectorAll(".nav-item").forEach(item => {
            if (parseInt(item.dataset.index) === currentRegionIndex) {
                item.classList.add("active");
                item.scrollIntoView({ behavior: "smooth", block: "nearest" });
            } else {
                item.classList.remove("active");
            }
        });

        // Actualizar Mapa GIS
        updateMapForRegion(data);
    }

    // ── 4. GRÁFICA CIRCULAR DE PROBOSQUE (CHART.JS) ──
    function updateProbosqueChart(modalidades) {
        const labels = Object.keys(modalidades);
        const values = Object.values(modalidades);
        const backgroundColors = labels.map(l => MODALIDADES_COLORS[l] || "#94a3b8");

        // Actualizar leyenda personalizada HTML
        const legendContainer = document.getElementById("probosqueCustomLegend");
        legendContainer.innerHTML = "";
        labels.forEach((label, idx) => {
            const pct = values[idx].toFixed(2) + "%";
            const row = document.createElement("div");
            row.className = "legend-item-custom";
            row.innerHTML = `
                <div class="legend-label-group">
                    <span class="legend-color-dot" style="background-color: ${backgroundColors[idx]}"></span>
                    <span class="legend-item-name" title="${label}">${label}</span>
                </div>
                <span class="legend-item-percent">${pct}</span>
            `;
            legendContainer.appendChild(row);
        });

        // Gráfica Chart.js
        const ctx = document.getElementById("probosqueChart").getContext("2d");

        if (probosqueChartInstance) {
            probosqueChartInstance.data.labels = labels;
            probosqueChartInstance.data.datasets[0].data = values;
            probosqueChartInstance.data.datasets[0].backgroundColor = backgroundColors;
            probosqueChartInstance.update();
        } else {
            probosqueChartInstance = new Chart(ctx, {
                type: "doughnut",
                data: {
                    labels: labels,
                    datasets: [{
                        data: values,
                        backgroundColor: backgroundColors,
                        borderWidth: 2,
                        borderColor: "#ffffff",
                        hoverOffset: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: "62%",
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return ` ${context.label}: ${context.parsed}%`;
                                }
                            }
                        }
                    },
                    animation: {
                        animateRotate: true,
                        duration: 800
                    }
                }
            });
        }
    }

    // ── 5. MAPA GIS LEAFLET (ESTILO INAB) ──
    function initMap() {
        map = L.map("map", {
            center: [15.78, -90.23],
            zoom: 7,
            zoomControl: false
        });

        L.control.zoom({ position: "topleft" }).addTo(map);

        // Capas Base
        const baseMaps = {
            sat: L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
                maxZoom: 19,
                attribution: "Esri Satellite"
            }),
            topo: L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}", {
                maxZoom: 19,
                attribution: "Esri Topographic"
            }),
            osm: L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 19,
                attribution: "OpenStreetMap"
            })
        };

        baseMaps.sat.addTo(map);

        // Relieve Hillshade
        hillshadeLayer = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}", {
            opacity: 0.6,
            maxZoom: 18
        });

        // Selector de Mapa Base
        document.querySelectorAll(".btn-basemap").forEach(btn => {
            btn.addEventListener("click", () => {
                document.querySelectorAll(".btn-basemap").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                const bType = btn.dataset.basemap;
                Object.values(baseMaps).forEach(layer => map.removeLayer(layer));
                baseMaps[bType].addTo(map);
                currentBasemap = bType;
            });
        });

        // Toggle Hillshade
        document.getElementById("layerChkHillshade").addEventListener("change", (e) => {
            if (e.target.checked) {
                hillshadeLayer.addTo(map);
            } else {
                map.removeLayer(hillshadeLayer);
            }
        });

        // Capa de Regiones Administrativas INAB (Carga de GeoJSON con fallback)
        loadRegionesLayer();

        // Capa de Proyectos de Restauración SMRPF (Esri Feature Service)
        initRestorationProjectsLayer();

        // Control de Toggle de Capas
        document.getElementById("layerChkRegiones").addEventListener("change", (e) => {
            if (!geojsonLayer) return;
            if (e.target.checked) map.addLayer(geojsonLayer);
            else map.removeLayer(geojsonLayer);
        });

        document.getElementById("layerChkProyectos").addEventListener("change", (e) => {
            if (!restorationLayer) return;
            if (e.target.checked) map.addLayer(restorationLayer);
            else map.removeLayer(restorationLayer);
        });

        // Botón Recentrar Mapa
        btnRecenterMap.addEventListener("click", () => {
            const currentData = REGIONS_DATA[REGION_KEYS[currentRegionIndex]];
            if (currentData) updateMapForRegion(currentData);
        });
    }

    // Carga de la capa de Regiones INAB
    function loadRegionesLayer() {
        fetch("regiones_inab.geojson")
            .then(res => res.json())
            .then(data => {
                geojsonLayer = L.geoJSON(data, {
                    style: styleRegionFeature,
                    onEachFeature: onEachRegionFeature
                }).addTo(map);
            })
            .catch(err => {
                console.warn("Cargando capa de regiones desde servicio ArcGIS INAB...", err);
                // Fallback directo al ArcGIS FeatureServer oficial de INAB
                if (typeof L.esri !== 'undefined') {
                    geojsonLayer = L.esri.featureLayer({
                        url: "https://sig.inab.gob.gt/server/rest/services/Hosted/Regiones_Subregiones_INAB/FeatureServer/0",
                        style: styleRegionFeature
                    }).addTo(map);
                }
            });
    }

    function styleRegionFeature(feature) {
        const p = feature.properties || {};
        const codreg = (p.codreg || "").toLowerCase();
        const currentData = REGIONS_DATA[REGION_KEYS[currentRegionIndex]];
        const isCurrent = currentData.codreg === "all" || currentData.codreg === codreg;

        return {
            color: isCurrent ? "#38bdf8" : "#94a3b8",
            weight: isCurrent ? 2.5 : 1,
            fillColor: isCurrent ? "#0284c7" : "#0f172a",
            fillOpacity: isCurrent ? 0.28 : 0.08,
            dashArray: isCurrent ? "" : "3"
        };
    }

    function onEachRegionFeature(feature, layer) {
        const p = feature.properties || {};
        const subreg = p.nomsubreg || p.nomofic || "Región INAB";
        const codreg = (p.codreg || "").toLowerCase();

        layer.on("mouseover", (e) => {
            const l = e.target;
            l.setStyle({
                weight: 3,
                color: "#f59e0b",
                fillOpacity: 0.4
            });
            l.bringToFront();
        });

        layer.on("mouseout", (e) => {
            if (geojsonLayer) geojsonLayer.resetStyle(e.target);
        });

        layer.on("click", () => {
            // Encontrar la región asociada en REGION_KEYS
            const foundIdx = REGION_KEYS.findIndex(k => REGIONS_DATA[k].codreg === codreg);
            if (foundIdx > 0) {
                selectRegionByIndex(foundIdx);
            }
        });

        // Popup Informativo
        layer.bindPopup(`
            <div class="popup-title">🗺️ ${subreg}</div>
            <div class="popup-row">
                <b>Región Oficial:</b> ${p.nomofic || '-'}<br>
                <b>Código Subregión:</b> ${p.cod || p.codsubreg || '-'}<br>
            </div>
            <button class="popup-btn-select" onclick="window.selectRegionByCod('${codreg}')">
                Ver Resultados de esta Región
            </button>
        `);
    }

    window.selectRegionByCod = function(codreg) {
        const foundIdx = REGION_KEYS.findIndex(k => REGIONS_DATA[k].codreg === codreg);
        if (foundIdx > 0) {
            selectRegionByIndex(foundIdx);
        }
    };

    // Capa de Proyectos de Restauración SMRPF (Polígonos oficiales del INAB)
    function initRestorationProjectsLayer() {
        if (typeof L.esri === 'undefined') return;

        try {
            restorationLayer = L.esri.featureLayer({
                url: "https://sig.inab.gob.gt/server/rest/services/Hosted/SM_Restauracion_vista/FeatureServer/0",
                style: function() {
                    return {
                        color: "#10b981",
                        weight: 1.5,
                        fillColor: "#34d399",
                        fillOpacity: 0.5
                    };
                }
            }).bindPopup(function(layer) {
                const p = layer.feature.properties || {};
                return `
                    <div class="popup-title">🌱 Proyecto de Restauración SMRPF</div>
                    <div class="popup-row">
                        <b>Código:</b> ${p.codigo || '-'}<br>
                        <b>Programa:</b> ${p.programa || '-'}<br>
                        <b>Barómetro UICN:</b> ${p.barometro || '-'}<br>
                        <b>Modalidad:</b> ${p.mod_inab || p.tipologiainter || '-'}<br>
                        <b>Área:</b> ${p.ha ? Number(p.ha).toFixed(2) + ' Ha' : '-'}<br>
                        <b>Carbono:</b> ${p.tco2_acu ? Number(p.tco2_acu).toFixed(2) + ' TCO2' : '-'}<br>
                        <b>Municipio:</b> ${p.municipionom || p.municipion || '-'}<br>
                        <b>Departamento:</b> ${p.depto || '-'}
                    </div>
                `;
            });

            restorationLayer.addTo(map);
        } catch (e) {
            console.warn("No se pudo inicializar la capa remota de proyectos SMRPF:", e);
        }
    }

    function updateMapForRegion(data) {
        if (!map) return;

        // Actualizar zoom y encuadre
        if (data.id === "general") {
            map.flyTo(data.center, data.zoom, { duration: 1.2 });
        } else if (data.bounds) {
            map.flyToBounds(data.bounds, { padding: [30, 30], duration: 1.2 });
        } else {
            map.flyTo(data.center, data.zoom, { duration: 1.2 });
        }

        // Refrescar estilo de regiones para resaltar la actual
        if (geojsonLayer && geojsonLayer.setStyle) {
            geojsonLayer.setStyle(styleRegionFeature);
        }
    }

    // ── 6. VISTA 2: COMPARATIVA INTERREGIONAL ──
    function initComparativeCharts() {
        const regionalKeys = REGION_KEYS.slice(1); // Excluir "general"
        const labels = regionalKeys.map(k => REGIONS_DATA[k].roman + " - " + REGIONS_DATA[k].name.replace("Región ", ""));
        const areas = regionalKeys.map(k => REGIONS_DATA[k].area_ha);
        const carbonos = regionalKeys.map(k => REGIONS_DATA[k].carbono_tco2 / 1000000); // En Millones TCO2
        const financiamiento = regionalKeys.map(k => REGIONS_DATA[k].financiamiento_usd / 1000000); // En Millones USD
        const empleos = regionalKeys.map(k => REGIONS_DATA[k].empleos);

        // Gráfica de Área
        const ctxArea = document.getElementById("compAreaChart").getContext("2d");
        compAreaChartInstance = new Chart(ctxArea, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: "Área Restaurada (Ha)",
                    data: areas,
                    backgroundColor: "#10b981",
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (c) => ` ${c.parsed.y.toLocaleString()} Ha`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: "Hectáreas (Ha)" }
                    },
                    x: {
                        ticks: { font: { size: 10 } }
                    }
                }
            }
        });

        // Gráfica de Carbono
        const ctxCarbono = document.getElementById("compCarbonoChart").getContext("2d");
        compCarbonoChartInstance = new Chart(ctxCarbono, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: "Carbono Capturado (Millones TCO2)",
                    data: carbonos,
                    backgroundColor: "#0284c7",
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (c) => ` ${c.parsed.y.toFixed(2)} Millones TCO2`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: "Millones de TCO2" }
                    },
                    x: {
                        ticks: { font: { size: 10 } }
                    }
                }
            }
        });

        // Gráfica Combinada Financiamiento ($M) vs Empleos
        const ctxFinEmpleos = document.getElementById("compFinEmpleosChart").getContext("2d");
        compFinEmpleosChartInstance = new Chart(ctxFinEmpleos, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Financiamiento ($ Millones USD)",
                        data: financiamiento,
                        backgroundColor: "#f59e0b",
                        yAxisID: "y",
                        borderRadius: 6
                    },
                    {
                        label: "Empleos Rurales Generados",
                        data: empleos,
                        type: "line",
                        borderColor: "#9333ea",
                        backgroundColor: "#9333ea",
                        borderWidth: 3,
                        pointRadius: 5,
                        yAxisID: "y1"
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        type: "linear",
                        display: true,
                        position: "left",
                        title: { display: true, text: "Financiamiento ($ Millones USD)" }
                    },
                    y1: {
                        type: "linear",
                        display: true,
                        position: "right",
                        grid: { drawOnChartArea: false },
                        title: { display: true, text: "Empleos Generados" }
                    }
                }
            }
        });

        // Construir Tabla
        buildComparativeTable();
    }

    function buildComparativeTable() {
        tableBody.innerHTML = "";
        REGION_KEYS.forEach(key => {
            const d = REGIONS_DATA[key];
            const tr = document.createElement("tr");
            if (key === "general") tr.className = "row-general";

            tr.innerHTML = `
                <td><strong>${d.name}</strong></td>
                <td><small>${d.deptos}</small></td>
                <td>${d.area_ha.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                <td>${d.carbono_tco2.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                <td>${d.ha_ap.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                <td>${d.empleos.toLocaleString("en-US")}</td>
                <td>$${d.financiamiento_usd.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                <td>${d.poligonos.toLocaleString("en-US")}</td>
            `;

            tr.style.cursor = "pointer";
            tr.title = "Haga clic para ver esta región en el Dashboard";
            tr.addEventListener("click", () => {
                const idx = REGION_KEYS.indexOf(key);
                switchView("dashboard");
                selectRegionByIndex(idx);
            });

            tableBody.appendChild(tr);
        });
    }

    // Filtro de búsqueda en la tabla
    tableFilterInput.addEventListener("input", (e) => {
        const term = e.target.value.toLowerCase();
        const rows = tableBody.querySelectorAll("tr");
        rows.forEach(r => {
            const text = r.textContent.toLowerCase();
            r.style.display = text.includes(term) ? "" : "none";
        });
    });

    // ── 7. EXPORTACIÓN DE DATOS CSV PARA EXCEL ──
    btnDownloadCSV.addEventListener("click", () => {
        let csvContent = "\uFEFFRegión,Departamentos,Área Restaurada (Ha),Carbono Capturado (TCO2),Ha en SIGAP,Empleos Generados,Financiamiento ($ USD),Polígonos Reportados\n";

        REGION_KEYS.forEach(key => {
            const d = REGIONS_DATA[key];
            const deptosClean = `"${d.deptos.replace(/"/g, '""')}"`;
            csvContent += `"${d.name}",${deptosClean},${d.area_ha},${d.carbono_tco2},${d.ha_ap},${d.empleos},${d.financiamiento_usd},${d.poligonos}\n`;
        });

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `SMRPF_Resultados_Tesis_Guatemala_2011_2025.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // ── 8. GESTIÓN DE VISTAS (PESTAÑAS) ──
    const tabButtons = document.querySelectorAll(".tab-btn");
    const viewPanels = document.querySelectorAll(".view-panel");

    function switchView(targetViewId) {
        tabButtons.forEach(b => {
            b.classList.toggle("active", b.dataset.view === targetViewId);
        });

        viewPanels.forEach(p => {
            p.classList.toggle("active", p.id === `view-${targetViewId}`);
        });

        // Si se cambia a dashboard, invalidar tamaño del mapa para evitar render gris
        if (targetViewId === "dashboard" && map) {
            setTimeout(() => {
                map.invalidateSize();
            }, 200);
        }

        // Si se cambia a comparativa por primera vez, inicializar gráficas
        if (targetViewId === "comparative" && !compAreaChartInstance) {
            initComparativeCharts();
        }
    }

    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            switchView(btn.dataset.view);
        });
    });

    // ── 9. NAVEGACIÓN ENTRE REGIONES / SLIDES ──
    function selectRegionByIndex(index) {
        if (index < 0 || index >= REGION_KEYS.length) return;
        currentRegionIndex = index;
        const regKey = REGION_KEYS[currentRegionIndex];
        updateDashboard(regKey);
    }

    btnPrevSlide.addEventListener("click", () => {
        if (currentRegionIndex > 0) {
            selectRegionByIndex(currentRegionIndex - 1);
        }
    });

    btnNextSlide.addEventListener("click", () => {
        if (currentRegionIndex < REGION_KEYS.length - 1) {
            selectRegionByIndex(currentRegionIndex + 1);
        }
    });

    // Atajos de teclado para defensa de tesis (← y →)
    document.addEventListener("keydown", (e) => {
        if (e.target.tagName === "INPUT") return; // Si está escribiendo en el buscador, no cambiar slide
        if (e.key === "ArrowLeft" || e.key === "PageUp") {
            if (currentRegionIndex > 0) selectRegionByIndex(currentRegionIndex - 1);
        } else if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
            if (currentRegionIndex < REGION_KEYS.length - 1) selectRegionByIndex(currentRegionIndex + 1);
        } else if (e.key === "Escape") {
            slideModal.classList.remove("open");
        }
    });

    // ── 10. MODAL DE DIAPOSITIVA CANVA ORIGINAL ──
    function openSlideModal() {
        const slideNumber = currentRegionIndex + 1;
        const currentData = REGIONS_DATA[REGION_KEYS[currentRegionIndex]];
        modalSlideImg.src = `assets/slides/page_${slideNumber}.png`;
        modalSlideTitle.textContent = `Lámina Canva Oficial (${slideNumber}/11) — ${currentData.name}`;
        slideModal.classList.add("open");
    }

    btnSlideView.addEventListener("click", openSlideModal);
    btnPreviewSlideInline.addEventListener("click", openSlideModal);

    modalCloseBtn.addEventListener("click", () => {
        slideModal.classList.remove("open");
    });

    slideModal.addEventListener("click", (e) => {
        if (e.target === slideModal) {
            slideModal.classList.remove("open");
        }
    });

    // ── 11. PANTALLA COMPLETA ──
    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.warn(`Error al intentar pantalla completa: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    btnFullscreen.addEventListener("click", toggleFullScreen);
    btnToggleBottomFs.addEventListener("click", toggleFullScreen);

    // Sidebar móvil toggle
    sidebarToggle.addEventListener("click", () => {
        sidebar.classList.toggle("open-mobile");
    });

    // ── INICIALIZACIÓN ──
    buildSidebar();
    initMap();
    selectRegionByIndex(0);
});
