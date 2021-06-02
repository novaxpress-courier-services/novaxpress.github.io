function format(input) {
    const quote = input => '"' + input.replaceAll(/"/g, '\\"') + '"';
    const cells = input.match(/".*?(?<!\\)"/g).map(cell => cell.trim().replaceAll(/^"|"$/g, ''));

    const signedBy = cells[29];
    const deliveryLocation = cells[60];
    const service = cells[3];
    const statusDescription = cells[27].toLowerCase();
    if (service !== 'UPS_STD') return null;

    let buildingIdentifier = 'HAL';
    let routeIdentifier = 'NXW';
    let barcode = cells[0];
    let time = cells[46];
    let status = '!!! MISSING INFORMATION !!!';
    let streetName = cells[12];
    let city = cells[14];
    let province = cells[15];
    let postalCode = cells[16];
    let customerName = cells[11];
    let confirmation = deliveryLocation || signedBy;

    if (statusDescription.includes('delivery')) {
        if (signedBy) {
            status = 'DWS';
        } else {
            status = 'DNS';
        }
    } else if (statusDescription.includes('closed')) {
        status = 'CLO';
    } else if (statusDescription.includes('bad address')) {
        status = 'INC';
    } else if (statusDescription.includes('reschedule')) {
        status = 'RES';
    } else if (statusDescription.includes('refused')) {
        status = 'REF';
    } else if (statusDescription.includes('return')) {
        status = 'RTU';
    } else if (statusDescription.includes('other')) {
        status = 'OFD';
    } else if (statusDescription.includes('no access')) {
        status = 'NAC';
    }

    // Where do "No Access" and "Business Closed" come from for "Sig_Confirm_Information_sign_or_location"
    // Which column in the ShipTrack data is "conv_time_date" from the UPS format.

    return [
        quote(buildingIdentifier),
        quote(routeIdentifier),
        quote(barcode),
        quote(time),
        quote(status),
        quote(streetName),
        quote(city),
        quote(province),
        quote(postalCode),
        quote(customerName),
        quote(confirmation)
    ].join(',');
}