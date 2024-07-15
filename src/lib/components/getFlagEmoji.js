// @ts-nocheck
// Funktion zum Abrufen des Flaggenemojis basierend auf dem Länderkürzel
export function getFlagEmoji(countryCode) {
    // Mapping von Länderkürzeln zu Flaggenemojis
    const flagEmojis = {
        "DE": "🇩🇪",
        "FR": "🇫🇷",
        "IT": "🇮🇹",
        "GB": "🇬🇧",
        "ES": "🇪🇸",
        "PT": "🇵🇹",
        "NL": "🇳🇱",
        "BE": "🇧🇪",
        "AT": "🇦🇹",
        "CH": "🇨🇭",
        "SE": "🇸🇪",
        "DK": "🇩🇰",
        "FI": "🇫🇮",
        "NO": "🇳🇴",
        "PL": "🇵🇱",
        "CZ": "🇨🇿",
        "SK": "🇸🇰",
        "HU": "🇭🇺",
        "GR": "🇬🇷",
        "TR": "🇹🇷",
        "RU": "🇷🇺",
        "US": "🇺🇸",
        "CA": "🇨🇦",
        "AU": "🇦🇺",
        "NZ": "🇳🇿"
    };

    // Gib das entsprechende Flaggenemoji für das Länderkürzel zurück
    return flagEmojis[countryCode] || '';
}
