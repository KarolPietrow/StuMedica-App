import WidgetKit
import SwiftUI

struct NextDoseData: Codable {
    let medName: String
    let medDosage: String
    let medTime: String
    let hasDose: Bool
}

struct Provider: AppIntentTimelineProvider {
    let appGroupId = "group.pl.stumedica.stumedica-mobile.widget"
    let storageKey = "nextDoseData"
  
    func loadData() -> NextDoseData {
        let userDefaults = UserDefaults(suiteName: appGroupId)
        
      if let jsonString = userDefaults?.string(forKey: storageKey) {
          if let data = jsonString.data(using: .utf8),
             let decoded = try? JSONDecoder().decode(NextDoseData.self, from: data) {
              return decoded
          }
      }
              
      return NextDoseData(medName: "Wszystkie leki wzięte", medDosage: "", medTime: "--:--", hasDose: false)
    }
  
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), configuration: ConfigurationAppIntent(), data: loadData())
    }

    func snapshot(for configuration: ConfigurationAppIntent, in context: Context) async -> SimpleEntry {
        SimpleEntry(date: Date(), configuration: configuration, data: loadData())
    }
    
    func timeline(for configuration: ConfigurationAppIntent, in context: Context) async -> Timeline<SimpleEntry> {
        let currentData = loadData()
      
        let entry = SimpleEntry(date: Date(), configuration: configuration, data: currentData)
      
        let nextUpdate = Calendar.current.date(byAdding: .minute, value: 15, to: Date())!

        return Timeline(entries: [entry], policy: .after(nextUpdate))
    }

//    func relevances() async -> WidgetRelevances<ConfigurationAppIntent> {
//        // Generate a list containing the contexts this widget is relevant in.
//    }
}

struct SimpleEntry: TimelineEntry {
  let date: Date
  let configuration: ConfigurationAppIntent
  let data: NextDoseData
}

struct widgetEntryView : View {
  var entry: Provider.Entry
  @Environment(\.widgetFamily) var family
  
  let primaryColor = Color(red: 118/255, green: 231/255, blue: 162/255)
  let surfaceColor = Color.white

  var body: some View {
    GeometryReader { geometry in
          if entry.data.hasDose {
            HStack(alignment: .center) {
              VStack(alignment: .leading, spacing: 0) {
                Text("Najbliższa dawka")
                  .font(.system(size: 10, weight: .bold))
                  .textCase(.uppercase)
                  .foregroundColor(.white.opacity(0.8))
                  .padding(.bottom, 4)
                
                Text(entry.data.medTime)
                  .font(.system(size: 32, weight: .bold))
                  .foregroundColor(.white)
                  .padding(.bottom, 2)
                
                Text(entry.data.medName)
                  .font(.system(size: 16, weight: .semibold))
                  .foregroundColor(.white)
                  .lineLimit(1)
                
                Text(entry.data.medDosage)
                  .font(.system(size: 13, weight: .regular))
                  .foregroundColor(.white.opacity(0.9))
                  .lineLimit(1)
              }
              
              if family != .systemSmall {
                Spacer()
                
                Image(systemName: "alarm.fill")
                  .resizable()
                  .aspectRatio(contentMode: .fit)
                  .frame(width: 40, height: 40)
                  .foregroundColor(.white.opacity(0.3))
              } else {
                Spacer()
              }
            }
            .padding()
            .frame(width: geometry.size.width, height: geometry.size.height)
              .background(primaryColor) // Tło całego widgetu
          } else {
              if family != .systemSmall {
                HStack(alignment: .center) {
                  VStack(alignment: .center, spacing: 4) {
                    Text("Na dzisiaj to wszystko")
                      .font(.system(size: 12, weight: .medium))
                      .foregroundColor(Color.gray)
                    
                    Text("Wszystkie leki wzięte")
                      .font(.system(size: 16, weight: .semibold))
                      .foregroundColor(Color.black)
                      .lineLimit(2)
                  }
                  
                  Spacer()
                  
                  Image(systemName: "checkmark.circle.fill")
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(width: 40, height: 40)
                    .foregroundColor(Color(red: 76/255, green: 217/255, blue: 100/255))
                }
                .padding()
                .frame(width: geometry.size.width, height: geometry.size.height)
                .background(surfaceColor)

              } else {
                HStack(alignment: .center) {
                  VStack(alignment: .leading, spacing: 4) {
                    Text("Na dzisiaj to wszystko")
                      .font(.system(size: 12, weight: .medium))
                      .foregroundColor(Color.gray)
                    
                    Text("Wszystkie leki wzięte")
                      .font(.system(size: 14, weight: .semibold))
                      .foregroundColor(Color.black)
                      .lineLimit(2)
                    
                    Image(systemName: "checkmark.circle.fill")
                      .resizable()
                      .aspectRatio(contentMode: .fit)
                      .frame(width: 40, height: 40)
                      .foregroundColor(Color(red: 76/255, green: 217/255, blue: 100/255))
                  }
                }
                .frame(width: geometry.size.width, height: geometry.size.height)
                .background(surfaceColor)
              }
          }
      }
      // Widgety w iOS 17+ wymagają jawnego ustawienia tła kontenera,
      // jeśli chcemy zignorować domyślne marginesy systemowe.
      .widgetURL(URL(string: "stumedica-mobile://medicine")) // Linkowanie deep link (opcjonalne)
  }
}

struct widget: Widget {
    let kind: String = "widget"

    var body: some WidgetConfiguration {
        AppIntentConfiguration(kind: kind, intent: ConfigurationAppIntent.self, provider: Provider()) { entry in
            widgetEntryView(entry: entry)
              .containerBackground(for: .widget) {
                // Ustawiamy tło kontenera w zależności od stanu, aby nie było białej ramki w iOS 17+
                if entry.data.hasDose {
                    Color(red: 118/255, green: 231/255, blue: 162/255)
                } else {
                    Color.white
                }
            }
        }
        .configurationDisplayName("Najbliższa dawka")
        .description("Pokazuje lek, który musisz wziąć w najbliższym czasie.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

extension ConfigurationAppIntent {
    fileprivate static var smiley: ConfigurationAppIntent {
        let intent = ConfigurationAppIntent()
        intent.favoriteEmoji = "😀"
        return intent
    }
    
    fileprivate static var starEyes: ConfigurationAppIntent {
        let intent = ConfigurationAppIntent()
        intent.favoriteEmoji = "🤩"
        return intent
    }
}

#Preview(as: .systemSmall) {
    widget()
} timeline: {
    // Stan 1: Jest dawka
    SimpleEntry(
        date: .now,
        configuration: .smiley,
        data: NextDoseData(medName: "Witamina D3", medDosage: "2000 IU", medTime: "08:00", hasDose: true)
    )
    // Stan 2: Wszystko wzięte
    SimpleEntry(
        date: .now,
        configuration: .smiley,
        data: NextDoseData(medName: "", medDosage: "", medTime: "", hasDose: false)
    )
}
