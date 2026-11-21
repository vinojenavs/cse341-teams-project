const hookRegionSorter = () => {
    const regionSelect = document.getElementById('region-filter');
    if (regionSelect) {
        regionSelect.addEventListener('change', () => {
            const selectedRegion = regionSelect.value;
            const url = new URL(window.location.href);

            if (selectedRegion && selectedRegion !== 'all') {
                url.searchParams.set('region', selectedRegion);
            } else {
                url.searchParams.delete('region');
            }
            
            window.location.href = url.toString();
        });
    }
};

const hookSeasonSorter = () => {
    const seasonSelect = document.getElementById('season-filter');
    if (seasonSelect) {
        seasonSelect.addEventListener('change', () => {
            const selectedSeason = seasonSelect.value;
            const url = new URL(window.location.href);

            if (selectedSeason && selectedSeason !== 'all') {
                url.searchParams.set('season', selectedSeason);
            } else {
                url.searchParams.delete('season');
            }
            
            window.location.href = url.toString();
        });
    }
};

const hookTrainsCatalog = async () => {
    const listEl = document.getElementById('trains-list');
    const templateEl = document.getElementById('train-card-template');
    const loadingEl = document.getElementById('trains-loading');
    const errorEl = document.getElementById('trains-error');

    if (!listEl || !templateEl) {
        return;
    }

    try {
        const response = await fetch('/api/trains');
        if (!response.ok) {
            throw new Error(`Failed to load trains (${response.status})`);
        }

        const payload = await response.json();
        const trains = payload.trains || [];
        const fragment = document.createDocumentFragment();

        trains.forEach((train) => {
            const card = templateEl.content.cloneNode(true);
            const imageEl = card.querySelector('[data-field="image"]');

            imageEl.src = train.imageUrl;
            imageEl.alt = train.imageAlt || `${train.name} train`;

            card.querySelector('[data-field="name"]').textContent = train.name;
            card.querySelector('[data-field="operator"]').textContent = train.operator;
            card.querySelector('[data-field="type"]').textContent = train.type;
            card.querySelector('[data-field="speed"]').textContent = `${train.maxSpeedKmh} km/h`;
            card.querySelector('[data-field="seats"]').textContent = `${train.capacity} seats`;
            card.querySelector('[data-field="power"]').textContent = train.powerSource;
            card.querySelector('[data-field="description"]').textContent = train.description;
            card.querySelector('[data-field="best-for"]').textContent = train.bestFor;

            fragment.appendChild(card);
        });

        listEl.replaceChildren(fragment);
        if (loadingEl) {
            loadingEl.hidden = true;
        }
    } catch (error) {
        if (loadingEl) {
            loadingEl.hidden = true;
        }
        if (errorEl) {
            errorEl.hidden = false;
            errorEl.textContent = 'Unable to load trains right now. Please try again in a moment.';
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    hookRegionSorter();
    hookSeasonSorter();
    hookTrainsCatalog();
});

document.addEventListener('DOMContentLoaded', async () => {
    const tripsList = document.getElementById('trips-list');
    const loading = document.getElementById('trips-loading');
    const error = document.getElementById('trips-error');
    const regionFilter = document.getElementById('region-filter');
    const seasonFilter = document.getElementById('season-filter');
    const template = document.getElementById('trip-card-template');

    let trips = [];

    function getDuration(trip) {
        if (!trip.departureDate || !trip.arrivalDate) {
            return 'Not specified';
        }

        const duration = new Date(trip.arrivalDate) -
            new Date(trip.departureDate);

        const hours = Math.floor(duration / 3600000);
        const minutes = Math.floor((duration % 3600000) / 60000);

        return `${hours}h ${minutes}m`;
    }

    function populateFilters() {
        const regions = [...new Set(
            trips.map(trip => trip.region).filter(Boolean)
        )];

        const seasons = [...new Set(
            trips.map(trip => trip.bestSeason).filter(Boolean)
        )];

        regions.forEach(region => {
            const option = document.createElement('option');
            option.value = region;
            option.textContent =
                region.charAt(0).toUpperCase() + region.slice(1);
            regionFilter.appendChild(option);
        });

        seasons.forEach(season => {
            const option = document.createElement('option');
            option.value = season;
            option.textContent =
                season.charAt(0).toUpperCase() + season.slice(1);
            seasonFilter.appendChild(option);
        });
    }

    function renderTrips() {
        tripsList.replaceChildren();

        const filteredTrips = trips.filter(trip => {
            const matchesRegion =
                regionFilter.value === 'all' ||
                trip.region === regionFilter.value;

            const matchesSeason =
                seasonFilter.value === 'all' ||
                trip.bestSeason === seasonFilter.value;

            return matchesRegion && matchesSeason;
        });

        if (filteredTrips.length === 0) {
            tripsList.textContent = 'No trips found.';
            return;
        }

        filteredTrips.forEach(trip => {
            const card = template.content.cloneNode(true);
            const setField = (field, value) => {
                const element = card.querySelector(`[data-field="${field}"]`);
                if (element) element.textContent = value ?? '';
            };

            setField('name', trip.name || `${trip.departure} to ${trip.destination}`);
            setField('region', trip.region);
            setField('departure', trip.startStation || trip.departure);
            setField('destination', trip.endStation || trip.destination);
            setField('duration', trip.duration || getDuration(trip));
            setField('price', trip.price != null ? `${trip.price}` : 'Not specified');
            setField('season', trip.bestSeason ? `Best in ${trip.bestSeason}` : trip.status);
            setField('description', trip.description);

            const highlights = card.querySelector('[data-field="highlights"]');

            (trip.highlights || []).forEach(highlight => {
                const tag = document.createElement('span');
                tag.className = 'highlight-tag';
                tag.textContent = highlight;
                highlights.appendChild(tag);
            });

            const seasonBadge = card.querySelector('[data-field="season"]');
            if (trip.bestSeason) {
                seasonBadge.classList.add(`season-${trip.bestSeason}`);
            }

            const detailsLink = card.querySelector('[data-field="details-link"]');
            detailsLink.href = `/trips/${encodeURIComponent(trip.id)}`;

            tripsList.appendChild(card);
        });
    }

    regionFilter.addEventListener('change', renderTrips);
    seasonFilter.addEventListener('change', renderTrips);

    try {
        const response = await fetch('/api/trips');

        if (!response.ok) {
            throw new Error('Unable to retrieve trips.');
        }

        const data = await response.json();
        trips = Array.isArray(data) ? data : data.trips || [];

        populateFilters();
        renderTrips();
    } catch (err) {
        error.textContent = err.message || 'An error occurred while loading trips.';
        error.hidden = false;
    } finally {
        loading.hidden = true;
    }
});
