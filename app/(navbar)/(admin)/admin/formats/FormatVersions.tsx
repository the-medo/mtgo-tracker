import FormatVersionsClient from '@/app/(navbar)/(admin)/admin/formats/FormatVersionsClient';

export default function FormatVersions() {
  return (
    <FormatVersionsClient
      data={[
        {
          id: 1,
          latestRelease: 'OTJ',
          latestBans: null,
          description: 'Outlaws release',
          validFrom: new Date('2024-04-19'),
        },
        {
          id: 2,
          latestRelease: 'MH3',
          latestBans: null,
          description: 'MH3 release',
          validFrom: new Date('2024-06-07'),
        },
      ]}
    />
  );
}
